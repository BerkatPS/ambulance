<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentCompletedNotification extends Notification implements ShouldQueue
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
        $paymentType = $this->booking->is_fully_paid ? 'Pembayaran Penuh' : 'Uang Muka';
        
        return (new MailMessage)
            ->subject("✅ {$paymentType} Berhasil Dilakukan - Pemesanan Ambulans #{$this->booking->booking_code}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Kabar baik! {$paymentType} Anda untuk Pemesanan Ambulans #{$this->booking->booking_code} telah berhasil diproses.")
            ->when(!$this->booking->is_fully_paid, function ($message) {
                return $message
                    ->line('Pemesanan Anda telah dikonfirmasi. Ingat bahwa Anda perlu menyelesaikan pembayaran akhir sebelum tanggal layanan yang dijadwalkan.')
                    ->line('Kedatangan ambulans Anda dijadwalkan pada: ' . $this->booking->scheduled_time->format('l, j F Y \p\u\k\u\l H:i'));
            })
            ->when($this->booking->is_fully_paid, function ($message) {
                return $message
                    ->line('Pemesanan Anda kini telah lunas. Ambulans Anda akan tiba sesuai jadwal.')
                    ->line('Kedatangan ambulans Anda dijadwalkan pada: ' . $this->booking->scheduled_time->format('l, j F Y \p\u\k\u\l H:i'));
            })
            ->line('Detail Pemesanan:')
            ->line('- ID Pemesanan: ' . $this->booking->booking_code)
            ->line('- Total Biaya: Rp ' . number_format($this->booking->total_amount, 0, ',', '.'))
            ->line('- Status Pembayaran: ' . ($this->booking->is_fully_paid ? 'Lunas' : 'Uang Muka Dibayar'))
            ->action('Lihat Detail Pemesanan', url('/bookings/' . $this->booking->id))
            ->line('Terima kasih telah memilih layanan ambulans kami.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $paymentType = $this->booking->is_fully_paid ? 'Pembayaran Penuh' : 'Uang Muka';
        
        return [
            'booking_id' => $this->booking->id,
            'booking_code' => $this->booking->booking_code,
            'title' => "{$paymentType} Selesai",
            'message' => "{$paymentType} untuk Pemesanan #{$this->booking->booking_code} telah berhasil diproses.",
            'scheduled_time' => $this->booking->scheduled_time->format('Y-m-d H:i:s'),
            'status' => $this->booking->status,
            'is_fully_paid' => $this->booking->is_fully_paid,
            'payment_type' => strtolower(str_replace(' ', '_', $paymentType)),
        ];
    }
}
