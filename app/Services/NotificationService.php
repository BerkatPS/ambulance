<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Ambulance;
use App\Models\Booking;
use App\Models\Driver;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\BookingCancelledNotification;
use App\Notifications\BookingConfirmedNotification;
use App\Notifications\BookingCreatedNotification;
use App\Notifications\DriverAssignedNotification;
use App\Notifications\EmergencyBookingNotification;
use App\Notifications\GenericNotification;
use App\Notifications\MaintenanceReminderNotification;
use App\Notifications\PaymentCompletedNotification;
use App\Notifications\PaymentReminderNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class NotificationService
{
    /**
     * Send a notification about a new booking.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function sendBookingCreatedNotification(Booking $booking): void
    {
        try {
            // Notify the user who created the booking
            $user = $booking->user;
            if ($user) {
                $user->notify(new BookingCreatedNotification($booking));
            }

            // Notify admins (if needed)
            $this->notifyAdmins('booking_created', $booking);

            Log::info('Notifikasi pemesanan baru terkirim', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi pemesanan baru', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a notification about a confirmed booking.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function sendBookingConfirmedNotification(Booking $booking): void
    {
        try {
            // Notify the user
            $user = $booking->user;
            if ($user) {
                $user->notify(new BookingConfirmedNotification($booking));
            }

            Log::info('Notifikasi konfirmasi pemesanan terkirim', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi konfirmasi pemesanan', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a notification about driver assignment.
     *
     * @param  \App\Models\Booking  $booking
     * @param  \App\Models\Driver  $driver
     * @return void
     */
    public function sendDriverAssignedNotification(Booking $booking, Driver $driver): void
    {
        try {
            // Notify the user
            $user = $booking->user;
            if ($user) {
                $user->notify(new DriverAssignedNotification($booking, $driver));
            }

            // Notify the driver (via a different channel if needed)
            $this->notifyDriver($driver, $booking);

            Log::info('Notifikasi penugasan pengemudi terkirim', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'driver_id' => $driver->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi penugasan pengemudi', [
                'booking_id' => $booking->id,
                'driver_id' => $driver->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a payment reminder notification.
     *
     * @param  \App\Models\Booking  $booking
     * @param  string  $reminderType
     * @param  int  $attempt
     * @return void
     */
    public function sendPaymentReminderNotification(Booking $booking, string $reminderType = 'standard', int $attempt = 1): void
    {
        try {
            // Notify the user
            $user = $booking->user;
            if ($user) {
                $user->notify(new PaymentReminderNotification($booking, $reminderType, $attempt));
            }

            Log::info('Notifikasi pengingat pembayaran terkirim', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'type' => $reminderType,
                'attempt' => $attempt,
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi pengingat pembayaran', [
                'booking_id' => $booking->id,
                'type' => $reminderType,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a notification about a completed payment.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function sendPaymentCompletedNotification(Booking $booking): void
    {
        try {
            // Notify the user
            $user = $booking->user;
            if ($user) {
                $user->notify(new PaymentCompletedNotification($booking));
            }

            Log::info('Notifikasi pembayaran selesai terkirim', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'payment_type' => $booking->is_fully_paid ? 'pembayaran_akhir' : 'uang_muka',
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi pembayaran selesai', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a maintenance reminder notification.
     *
     * @param  int  $ambulanceId
     * @param  string  $maintenanceType
     * @param  \DateTime  $scheduledDate
     * @return void
     */
    public function sendMaintenanceReminderNotification(int $ambulanceId, string $maintenanceType, \DateTime $scheduledDate): void
    {
        try {
            // Get the ambulance with driver info
            $ambulance = \App\Models\Ambulance::with('driver')->find($ambulanceId);
            if (!$ambulance) {
                throw new \Exception("Ambulance tidak ditemukan: {$ambulanceId}");
            }

            // Notify the driver if assigned
            if ($ambulance->driver) {
                $ambulance->driver->notify(new MaintenanceReminderNotification($ambulance, $maintenanceType, $scheduledDate));
            }

            // Notify maintenance staff (as a on-demand notification to a group)
            Notification::route('mail', config('app.maintenance_email'))
                ->notify(new MaintenanceReminderNotification($ambulance, $maintenanceType, $scheduledDate));

            Log::info('Notifikasi pengingat perawatan terkirim', [
                'ambulance_id' => $ambulanceId,
                'type' => $maintenanceType,
                'scheduled_date' => $scheduledDate->format('Y-m-d'),
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi pengingat perawatan', [
                'ambulance_id' => $ambulanceId,
                'type' => $maintenanceType,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a custom notification.
     *
     * @param  mixed  $notifiable
     * @param  mixed  $notification
     * @return void
     */
    public function sendCustomNotification($notifiable, $notification): void
    {
        try {
            if ($notifiable) {
                Notification::send($notifiable, $notification);
            }

            Log::info('Notifikasi kustom terkirim', [
                'notifiable_type' => is_object($notifiable) ? get_class($notifiable) : 'collection',
                'notification_type' => get_class($notification),
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi kustom', [
                'notification_type' => get_class($notification),
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a notification via SMS.
     *
     * @param  string  $phoneNumber
     * @param  string  $message
     * @return bool
     */
    public function sendSms(string $phoneNumber, string $message): bool
    {
        try {
            // In a real application, integrate with an SMS service like Twilio, Nexmo, etc.
            // For demonstration, we'll just log the message

            Log::info('Notifikasi SMS terkirim', [
                'phone' => $phoneNumber,
                'message' => $message,
            ]);

            // Simulate successful sending
            return true;
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi SMS', [
                'phone' => $phoneNumber,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Send a push notification.
     *
     * @param  string  $token
     * @param  string  $title
     * @param  string  $body
     * @param  array  $data
     * @return bool
     */
    public function sendPushNotification(string $token, string $title, string $body, array $data = []): bool
    {
        try {
            // In a real application, integrate with Firebase Cloud Messaging or another push service
            // For demonstration, we'll just log the notification

            Log::info('Notifikasi push terkirim', [
                'token' => $token,
                'title' => $title,
                'body' => $body,
                'data' => $data,
            ]);

            // Simulate successful sending
            return true;
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi push', [
                'token' => $token,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Notify admin users about an event.
     *
     * @param  string  $event
     * @param  mixed  $data
     * @return void
     */
    protected function notifyAdmins(string $event, $data): void
    {
        // In a real application, fetch admin users from the database
        // For demonstration, we'll just log that admins would be notified

        Log::info('Notifikasi admin terkirim', [
            'event' => $event,
            'data_type' => is_object($data) ? get_class($data) : gettype($data),
        ]);
    }

    /**
     * Send a notification to a driver.
     *
     * @param  \App\Models\Driver  $driver
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    protected function notifyDriver(Driver $driver, Booking $booking): void
    {
        // In a real application, determine the best way to notify the driver
        // For demonstration, we'll just log that a driver would be notified

        Log::info('Notifikasi pengemudi terkirim', [
            'driver_id' => $driver->id,
            'booking_id' => $booking->id,
        ]);

        // If driver has push token
        if ($driver->push_token) {
            $this->sendPushNotification(
                $driver->push_token,
                'Penugasan Baru',
                "Anda telah ditugaskan untuk pemesanan #{$booking->id}",
                ['booking_id' => $booking->id]
            );
        }

        // SMS notification
        if ($driver->phone) {
            $this->sendSms(
                $driver->phone,
                "Penugasan baru: Pickup di {$booking->pickup_address}. " .
                "Pasien: {$booking->patient_name}. " .
                "Periksa aplikasi Anda untuk detail."
            );
        }
    }

    /**
     * Send notification to admins about new emergency booking
     *
     * @param Booking $booking
     * @return void
     */
    public function sendEmergencyBookingNotification(Booking $booking): void
    {
        try {
            // Notifikasi ke admin tentang booking darurat
            $admins = User::whereHas('roles', function ($query) {
                $query->where('name', 'admin');
            })->get();
            
            \Log::info('Mengirim notifikasi booking darurat ke admin', [
                'booking_id' => $booking->id,
                'admin_count' => $admins->count(),
                'admin_ids' => $admins->pluck('id')->toArray()
            ]);

            Notification::send($admins, new EmergencyBookingNotification($booking));

            \Log::info('Notifikasi booking darurat terkirim', [
                'booking_id' => $booking->id
            ]);
        } catch (\Exception $e) {
            \Log::error('Gagal mengirim notifikasi booking darurat', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Send a notification to a specific user.
     *
     * @param  int  $userId
     * @param  string  $title
     * @param  string  $message
     * @param  string  $type
     * @param  int  $referenceId
     * @return void
     */
    public function sendToUser(int $userId, string $title, string $message, string $type = 'general', int $referenceId = null): void
    {
        try {
            $user = User::find($userId);
            
            if (!$user) {
                throw new \Exception("Pengguna tidak ditemukan: {$userId}");
            }
            
            // Create a generic notification data array
            $notificationData = [
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'reference_id' => $referenceId,
                'created_at' => now(),
            ];
            
            // For booking-related notifications
            if ($type === 'booking' && $referenceId) {
                $booking = Booking::find($referenceId);
                if ($booking) {
                    // Use appropriate notification class if available
                    switch ($message) {
                        case 'Pemesanan Anda telah dikonfirmasi.':
                            $user->notify(new BookingConfirmedNotification($booking));
                            break;
                        case 'Pemesanan Anda telah dibatalkan.':
                            // Handle cancelled booking notification
                            $user->notify(new \App\Notifications\GenericNotification($notificationData));
                            break;
                        default:
                            // Fall back to database notification
                            $user->notify(new \App\Notifications\GenericNotification($notificationData));
                            break;
                    }
                } else {
                    // If booking not found, send generic notification
                    $user->notify(new \App\Notifications\GenericNotification($notificationData));
                }
            } else {
                // For non-booking notifications, use generic notification
                $user->notify(new \App\Notifications\GenericNotification($notificationData));
            }
            
            // If user has push token, also send push notification
            if ($user->push_token) {
                $this->sendPushNotification(
                    $user->push_token,
                    $title,
                    $message,
                    [
                        'type' => $type,
                        'reference_id' => $referenceId
                    ]
                );
            }
            
            Log::info('Notifikasi terkirim ke pengguna', [
                'user_id' => $userId,
                'title' => $title,
                'type' => $type,
                'reference_id' => $referenceId
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi ke pengguna', [
                'user_id' => $userId,
                'title' => $title,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send a notification about a cancelled booking.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function sendBookingCancelledNotification(Booking $booking): void
    {
        try {
            // Notify the user
            $user = $booking->user;
            if ($user) {
                $this->sendToUser(
                    $user->id,
                    'Pemesanan Dibatalkan',
                    'Pemesanan ambulans Anda telah dibatalkan.',
                    'booking',
                    $booking->id
                );
            }

            Log::info('Notifikasi pembatalan pemesanan terkirim', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'cancel_reason' => $booking->cancel_reason,
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi pembatalan pemesanan', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a real-time payment reminder for emergency bookings.
     * Used for frequent (every 5 seconds) reminders for emergency booking payments.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function sendEmergencyPaymentReminder(Booking $booking): void
    {
        try {
            // Hanya kirim jika ini adalah booking darurat yang sudah selesai dengan pembayaran tertunda
            if ($booking->type === 'emergency' && 
                $booking->status === 'completed' && 
                $booking->payment && 
                $booking->payment->status === 'pending') {
                
                $user = $booking->user;
                if ($user) {
                    // Hanya kirim melalui broadcast channel untuk notifikasi real-time
                    $notification = new PaymentReminderNotification($booking, 'urgent', 1);
                    
                    // Buat pesan broadcast khusus untuk reminder real-time
                    $message = [
                        'id' => uniqid('emergency_payment_'),
                        'booking_id' => $booking->id,
                        'booking_number' => $booking->booking_number,
                        'message' => 'MENDESAK: Pembayaran untuk layanan ambulans darurat Anda menunggu pembayaran!',
                        'reminder_type' => 'urgent',
                        'amount_due' => $booking->total_amount,
                        'payment_url' => url('/user/bookings/' . $booking->id . '/payment'),
                        'sent_at' => now()->toDateTimeString(),
                        'is_realtime_reminder' => true,
                    ];
                    
                    // Broadcast langsung ke channel pribadi pengguna
                    broadcast(new \Illuminate\Notifications\Events\BroadcastNotificationCreated(
                        $message,
                        $notification,
                        ['broadcast']
                    ))->toOthers();
                    
                    Log::info('Pengingat pembayaran darurat real-time terkirim', [
                        'booking_id' => $booking->id,
                        'user_id' => $booking->user_id,
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::error('Gagal mengirim pengingat pembayaran darurat real-time', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send notification to admin
     *
     * @param string $title
     * @param string $message
     * @param string $type
     * @param int $referenceId
     * @return void
     */
    public function sendToAdmin(string $title, string $message, string $type = 'general', $referenceId = null): void
    {
        try {
            // Dapatkan semua admin (user dengan role admin)
            $admins = User::whereHas('roles', function ($query) {
                $query->where('name', 'admin');
            })->get();
            
            \Log::info('Mencoba mengirim notifikasi ke admin', [
                'admin_count' => $admins->count(),
                'title' => $title,
                'type' => $type
            ]);
            
            if ($admins->isEmpty()) {
                \Log::warning('Tidak ada admin yang ditemukan untuk menerima notifikasi');
                
                // Fallback: coba kirim ke user dengan ID 1 (biasanya super admin)
                $superAdmin = User::find(1);
                if ($superAdmin) {
                    $admins = collect([$superAdmin]);
                    \Log::info('Menggunakan super admin sebagai fallback untuk notifikasi', [
                        'super_admin_id' => $superAdmin->id
                    ]);
                }
            }
            
            // Kirim notifikasi menggunakan model GenericNotification atau EmergencyBookingNotification
            foreach ($admins as $admin) {
                if ($type === 'emergency_unassigned' && $referenceId) {
                    // Jika ini notifikasi darurat yang tidak ditugaskan, gunakan EmergencyBookingNotification
                    $booking = Booking::find($referenceId);
                    if ($booking) {
                        $admin->notify(new EmergencyBookingNotification($booking));
                    }
                } else {
                    // Untuk notifikasi umum lainnya
                    $admin->notify(new GenericNotification($title, $message, $type, $referenceId));
                }
                
                \Log::info('Notifikasi admin terkirim', [
                    'admin_id' => $admin->id,
                    'title' => $title,
                    'type' => $type
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Gagal mengirim notifikasi ke admin', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'title' => $title
            ]);
        }
    }

    /**
     * Send emergency payment reminder notification.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function sendEmergencyPaymentReminderNotification(Booking $booking): void
    {
        try {
            Log::info('Mengirim notifikasi pengingat pembayaran darurat', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'amount' => $booking->payment->amount ?? 0,
            ]);

            $user = $booking->user;
            if (!$user) {
                Log::error('User tidak ditemukan untuk pengingat pembayaran darurat', [
                    'booking_id' => $booking->id,
                    'user_id' => $booking->user_id,
                ]);
                return;
            }

            // Membuat data notifikasi
            $title = 'Pengingat Pembayaran Darurat';
            $message = "Mohon segera selesaikan pembayaran layanan darurat Anda sebesar Rp " . number_format($booking->payment->amount ?? 0, 0, ',', '.');
            
            // Kirim notifikasi ke database dan broadcast ke frontend
            $notification = new GenericNotification(
                $title,
                $message,
                'payment_reminder',
                $booking->id
            );

            // Set data tambahan untuk frontend
            $notification->payment_id = $booking->payment->id ?? null;
            $notification->amount = $booking->payment->amount ?? 0;
            $notification->is_emergency = true;
            
            $user->notify($notification);
            
            Log::info('Notifikasi pengingat pembayaran darurat terkirim', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'title' => $title,
            ]);

            // Juga kirim sebagai SMS jika tersedia nomor telepon
            if ($user->phone) {
                $this->sendSMS($user->phone, $message);
            }
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi pengingat pembayaran darurat', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }

    /**
     * Send payment expired notification.
     *
     * @param  \App\Models\Booking  $booking
     * @return void
     */
    public function sendPaymentExpiredNotification(Booking $booking): void
    {
        try {
            Log::info('Mengirim notifikasi pembayaran expired', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'payment_id' => $booking->payment->id ?? null,
            ]);

            $user = $booking->user;
            if (!$user) {
                Log::error('User tidak ditemukan untuk notifikasi pembayaran expired', [
                    'booking_id' => $booking->id,
                    'user_id' => $booking->user_id,
                ]);
                return;
            }

            $paymentType = $booking->type === 'emergency' ? 'darurat' : 'terjadwal';
            $amount = $booking->payment->amount ?? $booking->total_amount ?? 0;

            // Membuat data notifikasi
            $title = 'Batas Waktu Pembayaran Terlewati';
            $message = "Pembayaran untuk layanan {$paymentType} Anda sebesar Rp " . 
                       number_format($amount, 0, ',', '.') . 
                       " telah melewati batas waktu. Silakan hubungi customer service untuk informasi lebih lanjut.";
            
            // Kirim notifikasi ke database dan broadcast ke frontend
            $notification = new GenericNotification(
                $title,
                $message,
                'payment_expired',
                $booking->id
            );

            // Set data tambahan untuk frontend
            $notification->payment_id = $booking->payment->id ?? null;
            $notification->amount = $amount;
            $notification->is_emergency = $booking->type === 'emergency';
            
            $user->notify($notification);
            
            Log::info('Notifikasi pembayaran expired terkirim', [
                'booking_id' => $booking->id,
                'user_id' => $booking->user_id,
                'title' => $title,
            ]);

            // Juga kirim sebagai SMS jika tersedia nomor telepon
            if ($user->phone) {
                $this->sendSMS($user->phone, $message);
            }
            
            // Notifikasi admin
            $this->sendToAdmin(
                'Pembayaran Melewati Batas Waktu',
                "Booking #{$booking->id} ({$paymentType}) telah melewati batas waktu pembayaran. Nominal: Rp " . 
                number_format($amount, 0, ',', '.'),
                'payment_expired',
                $booking->id
            );
            
        } catch (\Exception $e) {
            Log::error('Gagal mengirim notifikasi pembayaran expired', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }
    }
}
