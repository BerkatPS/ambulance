<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class BookingConfirmedNotification extends Notification implements ShouldQueue
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
        
        // Tambahkan channel SMS untuk notifikasi darurat jika pengguna memiliki nomor telepon
        if ($notifiable->phone && ($this->booking->type === 'emergency' || $this->booking->is_urgent)) {
            $channels[] = 'vonage'; // atau penyedia SMS lain yang Anda gunakan
        }
        
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
            ->subject('Pemesanan Dikonfirmasi: ' . $this->booking->booking_number)
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line('Pemesanan ambulans Anda telah dikonfirmasi dan sedang diproses.')
            ->line('Nomor Pemesanan: ' . $this->booking->booking_number)
            ->line('Lokasi Penjemputan: ' . $this->booking->pickup_address)
            ->line('Tujuan: ' . $this->booking->destination_address)
            ->line('Waktu Terjadwal: ' . $this->booking->scheduled_time)
            ->action('Lacak Pemesanan Anda', $bookingUrl)
            ->line('Terima kasih telah menggunakan layanan ambulans kami.')
            ->line('Ambulans akan segera dikirim.');
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
            'title' => 'Pemesanan Dikonfirmasi',
            'message' => 'Pemesanan ambulans Anda telah dikonfirmasi dan sedang diproses.',
            'status' => $this->booking->status,
            'confirmed_at' => now()->toDateTimeString(),
            'action_url' => $bookingUrl,
            'action_text' => 'Lacak Pemesanan',
            'image_url' => '/images/icons/confirmed.png',
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
            'message' => 'Pemesanan ambulans Anda telah dikonfirmasi dan sedang diproses.',
            'status' => $this->booking->status,
            'confirmed_at' => now()->toDateTimeString(),
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
            'content' => "Pemesanan ambulans #{$this->booking->booking_number} telah dikonfirmasi. " .
                        "Ambulans akan tiba pada {$this->booking->scheduled_time}. " .
                        "Lacak di: " . url('/bookings/' . $this->booking->id),
        ];
    }
}
