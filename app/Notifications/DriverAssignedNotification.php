<?php

namespace App\Notifications;

use App\Models\Booking;
use App\Models\Driver;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class DriverAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    protected $booking;

    /**
     * The driver instance.
     *
     * @var \App\Models\Driver
     */
    protected $driver;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Booking  $booking
     * @param  \App\Models\Driver  $driver
     * @return void
     */
    public function __construct(Booking $booking, Driver $driver)
    {
        $this->booking = $booking;
        $this->driver = $driver;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        // Untuk penugasan pengemudi, prioritaskan saluran langsung
        $channels = ['mail', 'database'];
        
        // Tambahkan SMS untuk notifikasi langsung
        if ($notifiable->phone) {
            $channels[] = 'vonage'; // atau penyedia SMS lain yang Anda gunakan
        }
        
        // Tambahkan broadcast untuk pembaruan aplikasi real-time
        $channels[] = 'broadcast';
        
        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $bookingUrl = url('/bookings/' . $this->booking->id);
        
        // Sertakan detail ambulans dan pengemudi
        $ambulance = $this->driver->assignedAmbulance;
        $ambulanceInfo = $ambulance ? "Ambulans: {$ambulance->number_plate} ({$ambulance->type})" : "Detail ambulans akan diberikan segera.";
        
        return (new MailMessage)
            ->subject('Pengemudi Ditugaskan untuk Pemesanan Anda: ' . $this->booking->booking_number)
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Seorang pengemudi telah ditugaskan untuk pemesanan Anda.')
            ->line('Nomor Pemesanan: ' . $this->booking->booking_number)
            ->line('Nama Pengemudi: ' . $this->driver->name)
            ->line('Kontak Pengemudi: ' . $this->driver->phone)
            ->line($ambulanceInfo)
            ->line('Perkiraan Waktu Kedatangan: ' . $this->booking->estimated_arrival_time)
            ->action('Lacak Ambulans Anda', $bookingUrl)
            ->line('Anda dapat menghubungi pengemudi secara langsung jika diperlukan.')
            ->line('Terima kasih telah menggunakan layanan ambulans kami.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $ambulance = $this->driver->assignedAmbulance;
        $bookingUrl = url('/user/bookings/' . $this->booking->id);
        
        return [
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number ?? $this->booking->id,
            'title' => 'Pengemudi Ditugaskan',
            'message' => 'Seorang pengemudi telah ditugaskan untuk pemesanan Anda.',
            'status' => $this->booking->status,
            'driver' => [
                'id' => $this->driver->id,
                'name' => $this->driver->name,
                'phone' => $this->driver->phone,
                'rating' => $this->driver->average_rating,
            ],
            'ambulance' => $ambulance ? [
                'id' => $ambulance->id,
                'type' => $ambulance->type,
                'number_plate' => $ambulance->number_plate,
            ] : null,
            'estimated_arrival_time' => $this->booking->estimated_arrival_time,
            'assigned_at' => now()->toDateTimeString(),
            'action_url' => $bookingUrl,
            'action_text' => 'Lacak Pengemudi',
            'image_url' => '/images/icons/driver.png',
        ];
    }

    /**
     * Get the broadcastable representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return BroadcastMessage
     */
    public function toBroadcast($notifiable)
    {
        $ambulance = $this->driver->assignedAmbulance;
        
        return new BroadcastMessage([
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'message' => 'Seorang pengemudi telah ditugaskan untuk pemesanan Anda.',
            'status' => $this->booking->status,
            'driver' => [
                'id' => $this->driver->id,
                'name' => $this->driver->name,
                'phone' => $this->driver->phone,
                'rating' => $this->driver->average_rating,
                'current_latitude' => $this->driver->current_latitude,
                'current_longitude' => $this->driver->current_longitude,
            ],
            'ambulance' => $ambulance ? [
                'id' => $ambulance->id,
                'type' => $ambulance->type,
                'number_plate' => $ambulance->number_plate,
            ] : null,
            'estimated_arrival_time' => $this->booking->estimated_arrival_time,
            'assigned_at' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Get the Vonage / SMS representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toVonage($notifiable)
    {
        return [
            'content' => "Pengemudi ditugaskan untuk pemesanan #{$this->booking->booking_number}. " .
                        "Pengemudi: {$this->driver->name} ({$this->driver->phone}). " .
                        "Perkiraan waktu tiba: {$this->booking->estimated_arrival_time}. " .
                        "Lacak di: " . url('/bookings/' . $this->booking->id),
        ];
    }
}
