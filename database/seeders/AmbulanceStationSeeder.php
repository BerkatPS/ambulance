<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AmbulanceStation;

class AmbulanceStationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stations = [
            [
                'name' => 'Stasiun Ambulans Pusat Jakarta',
                'address' => 'Jl. Medan Merdeka Selatan No.8',
                'city' => 'Jakarta Pusat',
                'state' => 'DKI Jakarta',
                'postal_code' => '10110',
                'phone_number' => '021-5555123',
                'latitude' => -6.1753924,
                'longitude' => 106.8249641,
                'is_active' => true
            ],
            [
                'name' => 'Stasiun Ambulans RS Medika',
                'address' => 'Jl. MT Haryono No. 15',
                'city' => 'Jakarta Selatan',
                'state' => 'DKI Jakarta',
                'postal_code' => '12810',
                'phone_number' => '021-5555234',
                'latitude' => -6.2382699,
                'longitude' => 106.8326328,
                'is_active' => true
            ],
            [
                'name' => 'Stasiun Ambulans Barat',
                'address' => 'Jl. Panjang No. 50',
                'city' => 'Jakarta Barat',
                'state' => 'DKI Jakarta',
                'postal_code' => '11530',
                'phone_number' => '021-5555345',
                'latitude' => -6.1866304,
                'longitude' => 106.7271303,
                'is_active' => true
            ],
            [
                'name' => 'Stasiun Ambulans Timur',
                'address' => 'Jl. Raya Bekasi Km 18',
                'city' => 'Jakarta Timur',
                'state' => 'DKI Jakarta',
                'postal_code' => '13930',
                'phone_number' => '021-5555456',
                'latitude' => -6.2144507,
                'longitude' => 106.9005253,
                'is_active' => true
            ],
            [
                'name' => 'Stasiun Ambulans Utara',
                'address' => 'Jl. Danau Sunter Utara',
                'city' => 'Jakarta Utara',
                'state' => 'DKI Jakarta',
                'postal_code' => '14350',
                'phone_number' => '021-5555567',
                'latitude' => -6.1467206,
                'longitude' => 106.8657326,
                'is_active' => true
            ]
        ];
        
        foreach ($stations as $station) {
            AmbulanceStation::create($station);
        }
    }
}
