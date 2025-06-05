<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class BookingCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    protected $booking;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        // Tentukan channel yang akan digunakan berdasarkan preferensi pengguna atau pengaturan
        $channels = ['mail', 'database'];
        
        // Tambahkan channel broadcast jika pembaruan real-time diperlukan
        if ($notifiable->preferences['real_time_notifications'] ?? false) {
            $channels[] = 'broadcast';
        }
        
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
        
        return (new MailMessage)
            ->subject('Konfirmasi Pemesanan: ' . $this->booking->booking_number)
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Pemesanan ambulans Anda telah berhasil dibuat.')
            ->line('Nomor Pemesanan: ' . $this->booking->booking_number)
            ->line('Lokasi Penjemputan: ' . $this->booking->pickup_address)
            ->line('Tujuan: ' . $this->booking->destination_address)
            ->line('Waktu Terjadwal: ' . $this->booking->scheduled_time)
            ->action('Lihat Detail Pemesanan', $bookingUrl)
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
        $bookingUrl = url('/user/bookings/' . $this->booking->id);
        
        return [
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number ?? $this->booking->id,
            'title' => 'Pemesanan Dibuat',
            'message' => 'Pemesanan ambulans Anda telah berhasil dibuat.',
            'status' => $this->booking->status,
            'created_at' => $this->booking->created_at->toDateTimeString(),
            'action_url' => $bookingUrl,
            'action_text' => 'Lihat Pemesanan',
            'image_url' => '/images/icons/booking.png',
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
        return new BroadcastMessage([
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number,
            'message' => 'Pemesanan ambulans Anda telah berhasil dibuat.',
            'status' => $this->booking->status,
            'created_at' => $this->booking->created_at->toDateTimeString(),
        ]);
    }
}
