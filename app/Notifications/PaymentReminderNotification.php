<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class PaymentReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The booking instance.
     *
     * @var \App\Models\Booking
     */
    protected $booking;

    /**
     * The reminder type.
     *
     * @var string
     */
    protected $reminderType;

    /**
     * The attempt number.
     *
     * @var int
     */
    protected $attempt;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Booking  $booking
     * @param  string  $reminderType
     * @param  int  $attempt
     * @return void
     */
    public function __construct(Booking $booking, string $reminderType = 'standard', int $attempt = 1)
    {
        $this->booking = $booking;
        $this->reminderType = $reminderType;
        $this->attempt = $attempt;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        $channels = ['mail', 'database'];
        
        // Untuk pengingat mendesak atau final, tambahkan saluran SMS
        if (($this->reminderType === 'urgent' || $this->reminderType === 'final') && $notifiable->phone) {
            $channels[] = 'vonage'; // atau penyedia SMS lain yang Anda gunakan
        }
        
        // Tambahkan saluran broadcast jika diperlukan
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
        $paymentUrl = url('/bookings/' . $this->booking->id . '/payment');
        
        $mailMessage = (new MailMessage)
            ->subject($this->getSubjectLine())
            ->greeting('Halo ' . $notifiable->name . '!');
            
        // Sesuaikan pesan berdasarkan jenis pengingat
        switch ($this->reminderType) {
            case 'standard':
                $mailMessage->line('Ini adalah pengingat pembayaran untuk layanan ambulans Anda yang jatuh tempo.')
                    ->line('Nomor Pemesanan: ' . $this->booking->booking_number)
                    ->line('Jumlah Tagihan: Rp ' . number_format($this->booking->total_amount, 0, ',', '.'))
                    ->line('Jatuh Tempo: ' . now()->addDays(5)->format('d M Y'));
                break;
                
            case 'urgent':
                $mailMessage->line('MENDESAK: Pembayaran Anda untuk layanan ambulans telah melewati jatuh tempo.')
                    ->line('Nomor Pemesanan: ' . $this->booking->booking_number)
                    ->line('Jumlah Tagihan: Rp ' . number_format($this->booking->total_amount, 0, ',', '.'))
                    ->line('Jatuh Tempo: ' . now()->subDays(5)->format('d M Y') . ' (Terlambat)')
                    ->line('Mohon segera lakukan pembayaran untuk menghindari tindakan lebih lanjut.');
                break;
                
            case 'final':
                $mailMessage->line('PEMBERITAHUAN TERAKHIR: Pembayaran untuk layanan ambulans Anda memerlukan perhatian segera.')
                    ->line('Nomor Pemesanan: ' . $this->booking->booking_number)
                    ->line('Jumlah Tagihan: Rp ' . number_format($this->booking->total_amount, 0, ',', '.'))
                    ->line('Jatuh Tempo: ' . now()->subDays(15)->format('d M Y') . ' (Sangat Terlambat)')
                    ->line('Ini adalah pemberitahuan terakhir. Mohon segera lakukan pembayaran untuk menghindari biaya tambahan dan prosedur penagihan.');
                break;
        }
        
        return $mailMessage->action('Lakukan Pembayaran', $paymentUrl)
            ->line('Jika Anda telah melakukan pembayaran ini, abaikan pesan ini.')
            ->line('Terima kasih atas perhatian Anda terhadap hal ini.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $paymentUrl = url('/user/bookings/' . $this->booking->id . '/payment');
        $titlePrefix = $this->reminderType === 'urgent' ? 'Mendesak: ' : 
                      ($this->reminderType === 'final' ? 'Pemberitahuan Terakhir: ' : '');
        
        return [
            'booking_id' => $this->booking->id,
            'booking_number' => $this->booking->booking_number ?? $this->booking->id,
            'title' => $titlePrefix . 'Pengingat Pembayaran',
            'message' => $this->getMessageText(),
            'reminder_type' => $this->reminderType,
            'attempt' => $this->attempt,
            'amount_due' => $this->booking->total_amount,
            'sent_at' => now()->toDateTimeString(),
            'action_url' => $paymentUrl,
            'action_text' => 'Lakukan Pembayaran',
            'image_url' => '/images/icons/payment.png',
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
            'message' => $this->getMessageText(),
            'reminder_type' => $this->reminderType,
            'attempt' => $this->attempt,
            'amount_due' => $this->booking->total_amount,
            'payment_url' => url('/bookings/' . $this->booking->id . '/payment'),
            'sent_at' => now()->toDateTimeString(),
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
        $urgencyPrefix = $this->reminderType === 'urgent' ? 'MENDESAK: ' : 
                        ($this->reminderType === 'final' ? 'PEMBERITAHUAN TERAKHIR: ' : '');
        
        return [
            'content' => "{$urgencyPrefix}Pengingat pembayaran untuk pemesanan #{$this->booking->booking_number}. " .
                        "Jumlah tagihan: Rp " . number_format($this->booking->total_amount, 0, ',', '.') . ". " .
                        "Bayar di: " . url('/bookings/' . $this->booking->id . '/payment'),
        ];
    }

    /**
     * Get the appropriate subject line based on reminder type.
     *
     * @return string
     */
    protected function getSubjectLine(): string
    {
        switch ($this->reminderType) {
            case 'standard':
                return 'Pengingat Pembayaran: Pemesanan #' . $this->booking->booking_number;
            case 'urgent':
                return 'MENDESAK: Pembayaran Terlambat untuk Pemesanan #' . $this->booking->booking_number;
            case 'final':
                return 'PEMBERITAHUAN TERAKHIR: Pembayaran Segera Diperlukan untuk Pemesanan #' . $this->booking->booking_number;
            default:
                return 'Pengingat Pembayaran: Pemesanan #' . $this->booking->booking_number;
        }
    }

    /**
     * Get the appropriate message text based on reminder type.
     *
     * @return string
     */
    protected function getMessageText(): string
    {
        switch ($this->reminderType) {
            case 'standard':
                return 'Pembayaran Anda untuk pemesanan #' . $this->booking->booking_number . ' telah jatuh tempo.';
            case 'urgent':
                return 'MENDESAK: Pembayaran Anda untuk pemesanan #' . $this->booking->booking_number . ' telah terlambat.';
            case 'final':
                return 'PEMBERITAHUAN TERAKHIR: Pembayaran segera diperlukan untuk pemesanan #' . $this->booking->booking_number . '.';
            default:
                return 'Pengingat pembayaran untuk pemesanan #' . $this->booking->booking_number . '.';
        }
    }
}
