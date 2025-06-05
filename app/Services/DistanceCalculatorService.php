<?php

namespace App\Services;

use App\Models\DriverLocation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DistanceCalculatorService
{
    /**
     * Maps API key.
     *
     * @var string
     */
    protected $apiKey;

    /**
     * Whether to use external API for distance calculation.
     *
     * @var bool
     */
    protected $useExternalApi;

    /**
     * Create a new service instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->apiKey = config('services.maps.api_key');
        $this->useExternalApi = config('services.maps.use_external_api', false);
    }

    /**
     * Calculate direct distance between two points using Haversine formula.
     *
     * @param  float  $startLat
     * @param  float  $startLng
     * @param  float  $endLat
     * @param  float  $endLng
     * @return float Distance in kilometers
     */
    public function calculateDirectDistance(float $startLat, float $startLng, float $endLat, float $endLng): float
    {
        // Earth's radius in kilometers
        $earthRadius = 6371;

        // Convert latitude and longitude from degrees to radians
        $startLatRad = deg2rad($startLat);
        $startLngRad = deg2rad($startLng);
        $endLatRad = deg2rad($endLat);
        $endLngRad = deg2rad($endLng);

        // Calculate differences
        $latDiff = $endLatRad - $startLatRad;
        $lngDiff = $endLngRad - $startLngRad;

        // Haversine formula
        $a = sin($latDiff / 2) * sin($latDiff / 2) +
             cos($startLatRad) * cos($endLatRad) *
             sin($lngDiff / 2) * sin($lngDiff / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $earthRadius * $c;

        return round($distance, 2);
    }

    /**
     * Calculate road distance between two points using Maps API.
     *
     * @param  float  $startLat
     * @param  float  $startLng
     * @param  float  $endLat
     * @param  float  $endLng
     * @return float|null Distance in kilometers or null if calculation failed
     */
    public function calculateRoadDistance(float $startLat, float $startLng, float $endLat, float $endLng): ?float
    {
        // If external API is disabled, fall back to direct distance calculation
        if (!$this->useExternalApi || empty($this->apiKey)) {
            // Apply a multiplier to approximate road distance
            $directDistance = $this->calculateDirectDistance($startLat, $startLng, $endLat, $endLng);
            return $directDistance * 1.3; // Approximate road distance as 1.3 times direct distance
        }

        try {
            // Format coordinates
            $origin = "{$startLat},{$startLng}";
            $destination = "{$endLat},{$endLng}";

            // Make API request
            $response = Http::get('https://maps.googleapis.com/maps/api/directions/json', [
                'origin' => $origin,
                'destination' => $destination,
                'key' => $this->apiKey,
            ]);

            $data = $response->json();

            // Check for successful response
            if ($response->successful() && isset($data['routes'][0])) {
                // Extract distance in meters and convert to kilometers
                $distanceInMeters = $data['routes'][0]['legs'][0]['distance']['value'] ?? 0;
                return round($distanceInMeters / 1000, 2);
            }

            // Log API error
            Log::warning('Maps API distance calculation failed', [
                'status' => $data['status'] ?? 'Unknown error',
                'error_message' => $data['error_message'] ?? null,
            ]);

            // Fall back to direct distance calculation
            return $this->calculateDirectDistance($startLat, $startLng, $endLat, $endLng) * 1.3;
        } catch (\Exception $e) {
            Log::error('Error calculating road distance', [
                'error' => $e->getMessage(),
            ]);

            // Fall back to direct distance calculation
            return $this->calculateDirectDistance($startLat, $startLng, $endLat, $endLng) * 1.3;
        }
    }

    /**
     * Calculate distance traveled by a driver for a booking using location history.
     *
     * @param  int  $driverId
     * @param  int  $bookingId
     * @param  \DateTime|null  $startTime
     * @param  \DateTime|null  $endTime
     * @return float Distance in kilometers
     */
    public function calculateDistanceFromHistory(int $driverId, int $bookingId, $startTime = null, $endTime = null): float
    {
        // Set default time range if not provided
        $startTime = $startTime ?? now()->subHours(24);
        $endTime = $endTime ?? now();

        // Get driver location history within the time range
        $locations = DriverLocation::where('driver_id', $driverId)
            ->where('booking_id', $bookingId)
            ->whereBetween('created_at', [$startTime, $endTime])
            ->orderBy('created_at')
            ->get();

        // If less than 2 points, return 0
        if ($locations->count() < 2) {
            return 0;
        }

        // Calculate total distance by summing up distances between consecutive points
        $totalDistance = 0;
        $previousLocation = null;

        foreach ($locations as $location) {
            if ($previousLocation) {
                $distance = $this->calculateDirectDistance(
                    $previousLocation->latitude,
                    $previousLocation->longitude,
                    $location->latitude,
                    $location->longitude
                );

                // Only add if the distance is reasonable (to filter out GPS errors)
                // Assuming a maximum realistic speed of 120 km/h
                $timeIntervalInHours = $location->created_at->diffInSeconds($previousLocation->created_at) / 3600;
                $speed = $timeIntervalInHours > 0 ? $distance / $timeIntervalInHours : 0;

                if ($speed <= 120) {
                    $totalDistance += $distance;
                } else {
                    Log::warning('Unrealistic speed detected in distance calculation', [
                        'driver_id' => $driverId,
                        'booking_id' => $bookingId,
                        'point1' => [
                            'lat' => $previousLocation->latitude,
                            'lng' => $previousLocation->longitude,
                            'time' => $previousLocation->created_at->toDateTimeString(),
                        ],
                        'point2' => [
                            'lat' => $location->latitude,
                            'lng' => $location->longitude,
                            'time' => $location->created_at->toDateTimeString(),
                        ],
                        'speed' => $speed,
                        'distance' => $distance,
                    ]);
                }
            }

            $previousLocation = $location;
        }

        return round($totalDistance, 2);
    }

    /**
     * Estimate time of arrival based on distance and average speed.
     *
     * @param  float  $distance Distance in kilometers
     * @param  float  $averageSpeed Average speed in km/h (default: 40 km/h for urban areas)
     * @return int Estimated time in minutes
     */
    public function estimateArrivalTime(float $distance, float $averageSpeed = 40): int
    {
        // Calculate time in hours, then convert to minutes
        $timeInHours = $distance / $averageSpeed;
        $timeInMinutes = round($timeInHours * 60);

        // Ensure minimum ETA of 5 minutes
        return max(5, $timeInMinutes);
    }

    /**
     * Find nearest drivers to a location.
     *
     * @param  float  $latitude
     * @param  float  $longitude
     * @param  int  $limit Maximum number of drivers to return
     * @param  float  $maxDistance Maximum distance in kilometers
     * @param  string|null  $ambulanceType Type of ambulance required
     * @return array Array of drivers with distances
     */
    public function findNearestDrivers(float $latitude, float $longitude, int $limit = 5, float $maxDistance = 10, ?string $ambulanceType = null): array
    {
        try {
            // Get available drivers with their last known location
            $query = \App\Models\Driver::where('status', 'available')
                ->whereNotNull('current_latitude')
                ->whereNotNull('current_longitude');

            // Filter by ambulance type if specified
            if ($ambulanceType) {
                $query->whereHas('assignedAmbulance', function ($q) use ($ambulanceType) {
                    $q->where('type', $ambulanceType);
                });
            }

            $drivers = $query->get();

            // Calculate distance for each driver
            $driversWithDistance = [];
            foreach ($drivers as $driver) {
                $distance = $this->calculateDirectDistance(
                    $latitude,
                    $longitude,
                    $driver->current_latitude,
                    $driver->current_longitude
                );

                // Only include drivers within the maximum distance
                if ($distance <= $maxDistance) {
                    $driversWithDistance[] = [
                        'driver' => $driver,
                        'distance' => $distance,
                        'estimated_arrival_minutes' => $this->estimateArrivalTime($distance),
                    ];
                }
            }

            // Sort by distance (closest first)
            usort($driversWithDistance, function ($a, $b) {
                return $a['distance'] <=> $b['distance'];
            });

            // Limit the number of results
            return array_slice($driversWithDistance, 0, $limit);
        } catch (\Exception $e) {
            Log::error('Error finding nearest drivers', [
                'error' => $e->getMessage(),
                'latitude' => $latitude,
                'longitude' => $longitude,
            ]);

            return [];
        }
    }
}
