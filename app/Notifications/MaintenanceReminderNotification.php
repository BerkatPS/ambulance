<?php

namespace App\Notifications;

use App\Models\Ambulance;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class MaintenanceReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The ambulance instance.
     *
     * @var \App\Models\Ambulance
     */
    protected $ambulance;

    /**
     * The maintenance type.
     *
     * @var string
     */
    protected $maintenanceType;

    /**
     * The scheduled date.
     *
     * @var \DateTime
     */
    protected $scheduledDate;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Ambulance  $ambulance
     * @param  string  $maintenanceType
     * @param  \DateTime  $scheduledDate
     * @return void
     */
    public function __construct(Ambulance $ambulance, string $maintenanceType, \DateTime $scheduledDate)
    {
        $this->ambulance = $ambulance;
        $this->maintenanceType = $maintenanceType;
        $this->scheduledDate = $scheduledDate;
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
        
        // Untuk staf pemeliharaan atau pengemudi, tambahkan SMS untuk pemeliharaan kritis
        if (in_array($this->maintenanceType, ['safety', 'critical', 'emergency']) && 
            method_exists($notifiable, 'routeNotificationForVonage') && 
            $notifiable->routeNotificationForVonage()) {
            $channels[] = 'vonage'; // atau penyedia SMS lain yang Anda gunakan
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
        $maintenanceUrl = url('/admin/ambulances/' . $this->ambulance->id . '/maintenance');
        
        $mailMessage = (new MailMessage)
            ->subject($this->getSubjectLine())
            ->greeting('Halo ' . ($notifiable->name ?? 'semua') . '!');
            
        // Sertakan detail ambulans
        $mailMessage->line('Ini adalah pengingat untuk pemeliharaan terjadwal pada ambulans berikut:')
            ->line('Ambulans: ' . $this->ambulance->license_plate . ' (' . $this->ambulance->type . ')')
            ->line('Kode Kendaraan: ' . $this->ambulance->vehicle_code)
            ->line('Jenis Pemeliharaan: ' . ucfirst($this->getMaintenanceTypeInIndonesian()))
            ->line('Tanggal Terjadwal: ' . $this->scheduledDate->format('d M Y'));
            
        // Tambahkan detail spesifik berdasarkan tipe pemeliharaan
        switch ($this->maintenanceType) {
            case 'routine':
                $mailMessage->line('Ini adalah pemeriksaan pemeliharaan rutin yang meliputi penggantian oli, pemeriksaan rem, dan diagnostik sistem umum.');
                break;
                
            case 'safety':
                $mailMessage->line('Ini adalah pemeriksaan pemeliharaan keselamatan yang meliputi inspeksi sistem keselamatan kritis, peralatan darurat, dan perangkat medis.');
                break;
                
            case 'critical':
                $mailMessage->line('PENTING: Ini adalah persyaratan pemeliharaan kritis yang harus ditangani segera.');
                break;
                
            case 'scheduled':
                $mailMessage->line('Ini adalah pemeliharaan terjadwal berdasarkan interval servis kendaraan.');
                break;
        }
        
        return $mailMessage->action('Lihat Detail Pemeliharaan', $maintenanceUrl)
            ->line('Harap pastikan ambulans tersedia untuk pemeliharaan pada tanggal yang dijadwalkan.')
            ->line('Jika Anda perlu menjadwal ulang, silakan hubungi departemen pemeliharaan segera.');
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
            'ambulance_id' => $this->ambulance->id,
            'license_plate' => $this->ambulance->license_plate,
            'vehicle_code' => $this->ambulance->vehicle_code,
            'maintenance_type' => $this->maintenanceType,
            'scheduled_date' => $this->scheduledDate->format('Y-m-d'),
            'message' => $this->getMessageText(),
            'sent_at' => now()->toDateTimeString(),
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
            'ambulance_id' => $this->ambulance->id,
            'license_plate' => $this->ambulance->license_plate,
            'vehicle_code' => $this->ambulance->vehicle_code,
            'maintenance_type' => $this->maintenanceType,
            'scheduled_date' => $this->scheduledDate->format('Y-m-d'),
            'message' => $this->getMessageText(),
            'maintenance_url' => url('/admin/ambulances/' . $this->ambulance->id . '/maintenance'),
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
        $urgencyPrefix = in_array($this->maintenanceType, ['critical', 'emergency']) ? 'PENTING: ' : '';
        
        return [
            'content' => "{$urgencyPrefix}Pengingat pemeliharaan untuk ambulans {$this->ambulance->license_plate}. " .
                        "Jenis: " . ucfirst($this->getMaintenanceTypeInIndonesian()) . ". " .
                        "Tanggal: " . $this->scheduledDate->format('d M Y') . ". " .
                        "Detail: " . url('/admin/ambulances/' . $this->ambulance->id . '/maintenance'),
        ];
    }

    /**
     * Get the appropriate subject line based on maintenance type.
     *
     * @return string
     */
    protected function getSubjectLine(): string
    {
        $prefix = '';
        
        switch ($this->maintenanceType) {
            case 'critical':
                $prefix = 'SEGERA: ';
                break;
            case 'emergency':
                $prefix = 'DARURAT: ';
                break;
            case 'safety':
                $prefix = 'PENTING: ';
                break;
        }
        
        return $prefix . 'Pengingat Pemeliharaan untuk Ambulans ' . $this->ambulance->license_plate;
    }

    /**
     * Get the appropriate message text based on maintenance type.
     *
     * @return string
     */
    protected function getMessageText(): string
    {
        switch ($this->maintenanceType) {
            case 'routine':
                return 'Pemeliharaan rutin dijadwalkan untuk ambulans ' . $this->ambulance->license_plate;
            case 'safety':
                return 'Pemeliharaan keselamatan penting dijadwalkan untuk ambulans ' . $this->ambulance->license_plate;
            case 'critical':
                return 'SEGERA: Pemeliharaan kritis diperlukan untuk ambulans ' . $this->ambulance->license_plate;
            case 'emergency':
                return 'DARURAT: Pemeliharaan segera diperlukan untuk ambulans ' . $this->ambulance->license_plate;
            default:
                return 'Pemeliharaan dijadwalkan untuk ambulans ' . $this->ambulance->license_plate;
        }
    }

    /**
     * Get the maintenance type in Indonesian.
     *
     * @return string
     */
    protected function getMaintenanceTypeInIndonesian(): string
    {
        switch ($this->maintenanceType) {
            case 'routine':
                return 'rutin';
            case 'safety':
                return 'keselamatan';
            case 'critical':
                return 'kritis';
            case 'emergency':
                return 'darurat';
            case 'scheduled':
                return 'terjadwal';
            default:
                return $this->maintenanceType;
        }
    }
}
