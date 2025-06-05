<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AmbulanceType;

class AmbulanceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Ambulans Gawat Darurat (AGD)',
                'description' => 'Ambulans untuk penanganan kasus gawat darurat dengan peralatan medis lengkap',
                'capacity' => 2,
                'equipment_level' => 'Tinggi',
                'is_active' => true
            ],
            [
                'name' => 'Ambulans Perawatan Intensif (API)',
                'description' => 'Ambulans dengan fasilitas perawatan intensif untuk pasien kritis',
                'capacity' => 1,
                'equipment_level' => 'Sangat Tinggi',
                'is_active' => true
            ],
            [
                'name' => 'Ambulans Transpor Pasien (ATP)',
                'description' => 'Ambulans untuk mengangkut pasien antar fasilitas kesehatan',
                'capacity' => 3,
                'equipment_level' => 'Menengah',
                'is_active' => true
            ],
            [
                'name' => 'Ambulans Khusus',
                'description' => 'Ambulans dengan modifikasi khusus untuk kebutuhan tertentu',
                'capacity' => 2,
                'equipment_level' => 'Khusus',
                'is_active' => true
            ]
        ];
        
        foreach ($types as $type) {
            AmbulanceType::create($type);
        }
    }
}
