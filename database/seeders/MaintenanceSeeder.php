<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MaintenanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if maintenance records already exist
        $existingCount = DB::table('maintenance')->count();
        if ($existingCount > 0) {
            // Delete all existing maintenance records to avoid duplicates
            DB::table('maintenance')->delete();
        }
        
        // Get existing ambulance IDs to prevent foreign key constraint violations
        $ambulanceIds = DB::table('ambulances')->pluck('id')->toArray();
        
        // If no ambulances exist, we can't create maintenance records
        if (empty($ambulanceIds)) {
            $this->command->info('No ambulances found in the database. Skipping maintenance seeding.');
            return;
        }
        
        $maintenanceTypes = ['service', 'repair', 'routine', 'inspection', 'equipment'];
        $statuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
        $technicians = [
            'Ahmad Teknisi',
            'Budi Santoso',
            'Eko Prasetyo',
            'Wijaya Motor',
            'PT. Medika Teknik',
            'Bengkel Resmi',
            'Dinas Perhubungan',
            'Teknik Pendingin Sejahtera'
        ];
        
        // Create maintenance records using existing ambulance IDs
        $maintenanceRecords = [];
        $counter = 1;
        
        // Add some completed maintenance
        for ($i = 0; $i < 5; $i++) {
            $ambulanceId = $ambulanceIds[array_rand($ambulanceIds)];
            $maintenanceType = $maintenanceTypes[array_rand($maintenanceTypes)];
            $startDate = Carbon::now()->subDays(rand(5, 60));
            $endDate = (clone $startDate)->addDays(rand(1, 3));
            
            $maintenanceRecords[] = [
                'ambulance_id' => $ambulanceId,
                'maintenance_code' => 'MNT-' . str_pad($counter++, 3, '0', STR_PAD_LEFT),
                'maintenance_type' => $maintenanceType,
                'description' => $this->getDescriptionByType($maintenanceType),
                'cost' => rand(500, 5000) * 1000, // 500k - 5M IDR
                'technician_name' => $technicians[array_rand($technicians)],
                'notes' => $this->getNotesByType($maintenanceType),
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'completed',
                'created_at' => $startDate->subDays(rand(1, 7)),
                'updated_at' => $endDate,
            ];
        }
        
        // Add some in progress maintenance
        for ($i = 0; $i < 3; $i++) {
            $ambulanceId = $ambulanceIds[array_rand($ambulanceIds)];
            $maintenanceType = $maintenanceTypes[array_rand($maintenanceTypes)];
            $startDate = Carbon::now()->subDays(rand(1, 5));
            
            $maintenanceRecords[] = [
                'ambulance_id' => $ambulanceId,
                'maintenance_code' => 'MNT-' . str_pad($counter++, 3, '0', STR_PAD_LEFT),
                'maintenance_type' => $maintenanceType,
                'description' => $this->getDescriptionByType($maintenanceType),
                'cost' => rand(500, 5000) * 1000,
                'technician_name' => $technicians[array_rand($technicians)],
                'notes' => $this->getNotesByType($maintenanceType),
                'start_date' => $startDate,
                'end_date' => null,
                'status' => 'in_progress',
                'created_at' => $startDate->subDays(rand(1, 7)),
                'updated_at' => $startDate->addDays(1),
            ];
        }
        
        // Add some scheduled maintenance
        for ($i = 0; $i < 5; $i++) {
            $ambulanceId = $ambulanceIds[array_rand($ambulanceIds)];
            $maintenanceType = $maintenanceTypes[array_rand($maintenanceTypes)];
            $startDate = Carbon::now()->addDays(rand(1, 30));
            
            $maintenanceRecords[] = [
                'ambulance_id' => $ambulanceId,
                'maintenance_code' => 'MNT-' . str_pad($counter++, 3, '0', STR_PAD_LEFT),
                'maintenance_type' => $maintenanceType,
                'description' => $this->getDescriptionByType($maintenanceType),
                'cost' => rand(500, 5000) * 1000,
                'technician_name' => $technicians[array_rand($technicians)],
                'notes' => $this->getNotesByType($maintenanceType),
                'start_date' => $startDate,
                'end_date' => null,
                'status' => 'scheduled',
                'created_at' => Carbon::now()->subDays(rand(1, 10)),
                'updated_at' => Carbon::now()->subDays(rand(0, 1)),
            ];
        }
        
        // Add a couple of cancelled maintenance
        for ($i = 0; $i < 2; $i++) {
            $ambulanceId = $ambulanceIds[array_rand($ambulanceIds)];
            $maintenanceType = $maintenanceTypes[array_rand($maintenanceTypes)];
            $createdDate = Carbon::now()->subDays(rand(10, 30));
            $cancelledDate = (clone $createdDate)->addDays(rand(1, 5));
            
            $maintenanceRecords[] = [
                'ambulance_id' => $ambulanceId,
                'maintenance_code' => 'MNT-' . str_pad($counter++, 3, '0', STR_PAD_LEFT),
                'maintenance_type' => $maintenanceType,
                'description' => $this->getDescriptionByType($maintenanceType),
                'cost' => rand(500, 5000) * 1000,
                'technician_name' => $technicians[array_rand($technicians)],
                'notes' => 'Pemeliharaan dibatalkan karena ' . $this->getCancellationReason(),
                'start_date' => $cancelledDate->addDays(1),
                'end_date' => null,
                'status' => 'cancelled',
                'created_at' => $createdDate,
                'updated_at' => $cancelledDate,
            ];
        }

        // Insert all maintenance records
        DB::table('maintenance')->insert($maintenanceRecords);
        
        // Update ambulance status for vehicles that are currently in maintenance
        $ambulancesInMaintenanceIds = DB::table('maintenance')
            ->whereIn('status', ['scheduled', 'in_progress'])
            ->whereDate('start_date', '<=', Carbon::today())
            ->whereNull('end_date')
            ->pluck('ambulance_id')
            ->unique()
            ->toArray();
        
        if (!empty($ambulancesInMaintenanceIds)) {
            DB::table('ambulances')
                ->whereIn('id', $ambulancesInMaintenanceIds)
                ->update(['status' => 'maintenance']);
        }
    }
    
    /**
     * Get a description based on maintenance type
     * 
     * @param string $type
     * @return string
     */
    private function getDescriptionByType($type)
    {
        $descriptions = [
            'service' => [
                'Perawatan rutin 3 bulan: pergantian oli, filter udara, pengecekan rem',
                'Perawatan rutin 6 bulan: tune up mesin, pergantian oli, filter',
                'Servis berkala 10.000 km termasuk penggantian aki',
                'Perawatan sistem pendinginan dan pemeriksaan radiator',
            ],
            'repair' => [
                'Perbaikan sistem rem dan penggantian kampas rem',
                'Perbaikan transmisi dan kopling',
                'Perbaikan sistem kelistrikan lampu dan sirene',
                'Perbaikan sistem kemudi dan suspensi',
            ],
            'routine' => [
                'Perawatan AC dan sistem sirkulasi udara',
                'Penggantian filter bahan bakar dan sistem injeksi',
                'Pemeriksaan dan kalibrasi speedometer',
                'Perawatan dan pengecekan sistem audio dan komunikasi',
            ],
            'inspection' => [
                'Inspeksi rutin kelaikan ambulans',
                'Pemeriksaan tahunan kendaraan operasional',
                'Audit keselamatan dan kelengkapan perangkat medis',
                'Sertifikasi ulang kelayakan ambulans',
            ],
            'equipment' => [
                'Kalibrasi dan perawatan alat medis ambulans',
                'Penggantian tabung oksigen dan regulator',
                'Perawatan tandu dan sistem pengamannya',
                'Pembaharuan peralatan medis darurat sesuai standar',
            ],
        ];
        
        $typeDescriptions = $descriptions[$type] ?? $descriptions['service'];
        return $typeDescriptions[array_rand($typeDescriptions)];
    }
    
    /**
     * Get notes based on maintenance type
     * 
     * @param string $type
     * @return string|null
     */
    private function getNotesByType($type)
    {
        if (rand(0, 10) < 2) {
            return null; // 20% chance of having no notes
        }
        
        $notes = [
            'service' => [
                'Ambulans dalam kondisi baik, hanya membutuhkan perawatan rutin',
                'Terdeteksi keausan pada sistem pengereman, perlu penggantian dalam 3 bulan ke depan',
                'Penggantian oli dan filter sesuai jadwal',
                'Ambulans beroperasi normal setelah perawatan',
            ],
            'repair' => [
                'Penggantian seluruh sistem rem belakang',
                'Pergantian komponen kopling dan pelumas transmisi',
                'Diperlukan suku cadang khusus yang harus dipesan',
                'Perbaikan berhasil, performa kembali optimal',
            ],
            'routine' => [
                'Pergantian freon dan pembersihan filter AC',
                'Pembersihan injektor dan penggantian filter bahan bakar',
                'Pengecekan semua sensor dan sistem elektronik',
                'Penyetelan ulang sistem audio dan komunikasi',
            ],
            'inspection' => [
                'Inspeksi rutin tahunan oleh Dishub',
                'Semua aspek keselamatan sesuai standar',
                'Beberapa item kecil perlu ditindaklanjuti dalam 30 hari',
                'Lulus semua tes keselamatan dan emisi',
            ],
            'equipment' => [
                'Perbaikan ventilator dan kalibrasi alat pengukur tekanan darah',
                'Penggantian selang oksigen dan regulator',
                'Pemasangan sistem mounting baru untuk peralatan medis',
                'Semua peralatan berhasil dikalibrasi sesuai standar',
            ],
        ];
        
        $typeNotes = $notes[$type] ?? $notes['service'];
        return $typeNotes[array_rand($typeNotes)];
    }
    
    /**
     * Get random cancellation reason
     * 
     * @return string
     */
    private function getCancellationReason()
    {
        $reasons = [
            'perubahan jadwal operasional',
            'pergantian vendor perawatan',
            'ambulans dibutuhkan untuk operasi darurat',
            'penggantian dengan perawatan yang lebih komprehensif',
            'ambulans dialihfungsikan sementara',
            'teknisi tidak tersedia pada waktu yang dijadwalkan',
        ];
        
        return $reasons[array_rand($reasons)];
    }
}
