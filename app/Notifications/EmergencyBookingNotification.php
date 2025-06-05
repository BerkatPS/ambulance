<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmergencyBookingNotification extends Notification implements ShouldQueue
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
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = route('admin.bookings.show', $this->booking->id);
        
        return (new MailMessage)
            ->subject('🚨 PERINGATAN PEMESANAN DARURAT: ' . $this->booking->booking_code)
            ->line('Pemesanan ambulans darurat telah dibuat dan memerlukan perhatian segera.')
            ->line('Pasien: ' . $this->booking->patient_name)
            ->line('Kontak: ' . $this->booking->contact_name . ' (' . $this->booking->contact_phone . ')')
            ->line('Lokasi Penjemputan: ' . $this->booking->pickup_address)
            ->line('Tujuan: ' . $this->booking->destination_address)
            ->action('Lihat Detail Pemesanan', $url)
            ->line('Harap proses pemesanan darurat ini sesegera mungkin.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toDatabase($notifiable)
    {
        return [
            'id' => $this->booking->id,
            'booking_code' => $this->booking->booking_code,
            'title' => 'Peringatan Pemesanan Darurat',
            'message' => 'Pemesanan darurat baru dari ' . $this->booking->patient_name,
            'patient_name' => $this->booking->patient_name,
            'pickup_address' => $this->booking->pickup_address,
            'contact_phone' => $this->booking->contact_phone,
            'type' => 'emergency_booking',
            'icon' => 'emergency',
            'color' => 'red',
            'action_url' => route('admin.bookings.show', $this->booking->id),
            'action_text' => 'Lihat Detail',
            'created_at' => now()->toDateTimeString()
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'booking_id' => $this->booking->id,
            'booking_code' => $this->booking->booking_code,
            'user_id' => $this->booking->user_id,
            'patient_name' => $this->booking->patient_name,
            'contact_phone' => $this->booking->contact_phone,
            'pickup_address' => $this->booking->pickup_address,
            'destination_address' => $this->booking->destination_address,
            'type' => 'emergency_booking'
        ];
    }
}
