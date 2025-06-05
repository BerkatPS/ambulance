<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class GenericNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The notification data.
     *
     * @var array
     */
    protected $data;

    /**
     * Create a new notification instance.
     *
     * @param string $title
     * @param string $message
     * @param string $type
     * @param mixed $referenceId
     * @return void
     */
    public function __construct(string $title, string $message, string $type = 'general', $referenceId = null)
    {
        $this->data = [
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'reference_id' => $referenceId,
            'time' => now()->toIso8601String()
        ];
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        // Tentukan channel yang akan digunakan berdasarkan preferensi pengguna atau tipe data
        $channels = ['database'];
        
        // Tambahkan channel email jika ini adalah notifikasi penting
        if (isset($this->data['send_email']) && $this->data['send_email']) {
            $channels[] = 'mail';
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
        $mailMessage = (new MailMessage)
            ->subject($this->data['title'] ?? 'Notifikasi dari Portal Ambulans')
            ->greeting('Halo ' . $notifiable->name . '!')
            ->line($this->data['message'] ?? 'Anda memiliki notifikasi baru.');
        
        // Tambahkan tombol aksi jika URL disediakan
        if (isset($this->data['action_url']) && isset($this->data['action_text'])) {
            $mailMessage->action($this->data['action_text'], $this->data['action_url']);
        }
        
        // Tambahkan referensi ke pemesanan jika ini adalah notifikasi pemesanan
        if (isset($this->data['type']) && $this->data['type'] === 'booking' && isset($this->data['reference_id'])) {
            $bookingUrl = url('/user/bookings/' . $this->data['reference_id']);
            $mailMessage->line('Notifikasi ini terkait dengan pemesanan ambulans #' . $this->data['reference_id'] . '.')
                        ->action('Lihat Detail Pemesanan', $bookingUrl);
        }
        
        return $mailMessage->line('Terima kasih telah menggunakan layanan ambulans kami.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $notificationData = [
            'title' => $this->data['title'] ?? 'Notifikasi Baru',
            'message' => $this->data['message'] ?? 'Anda memiliki notifikasi baru',
            'type' => $this->data['type'] ?? 'general',
            'created_at' => $this->data['time'] ?? now()->toDateTimeString(),
        ];
        
        // Tambahkan ID referensi jika tersedia
        if (isset($this->data['reference_id'])) {
            $notificationData['reference_id'] = $this->data['reference_id'];
            
            // Tambahkan URL spesifik untuk tipe yang berbeda
            if ($this->data['type'] === 'booking') {
                $notificationData['action_url'] = url('/user/bookings/' . $this->data['reference_id']);
                $notificationData['action_text'] = 'Lihat Pemesanan';
            }
        }
        
        // Tambahkan data tambahan lainnya
        if (isset($this->data['additional_data'])) {
            $notificationData['additional_data'] = $this->data['additional_data'];
        }
        
        return $notificationData;
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
            'title' => $this->data['title'] ?? 'Notifikasi Baru',
            'message' => $this->data['message'] ?? 'Anda memiliki notifikasi baru',
            'type' => $this->data['type'] ?? 'general',
            'reference_id' => $this->data['reference_id'] ?? null,
            'created_at' => $this->data['time'] ?? now()->toDateTimeString(),
        ]);
    }
}
