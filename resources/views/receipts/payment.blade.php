<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bukti Pembayaran #{{ $payment->transaction_id }}</title>
    <style>
        body {
            font-family: 'Poppins', 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #fcfcfc;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            background-color: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
            position: relative;
            border-radius: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
            position: relative;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 15px;
        }
        .receipt-title {
            font-size: 28px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        .receipt-subtitle {
            font-size: 16px;
            color: #6b7280;
        }
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        .info-block {
            width: 48%;
            background-color: #f9fafb;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
        }
        .info-title {
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 15px;
            color: #1e40af;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
        }
        .info-detail {
            margin-bottom: 10px;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
        }
        .info-detail-label {
            font-weight: 500;
            color: #4b5563;
            min-width: 180px;
        }
        .info-detail-value {
            font-weight: 400;
            text-align: right;
            color: #111827;
        }
        .payment-details {
            margin-bottom: 30px;
            background-color: #f9fafb;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
        }
        .payment-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .payment-table th, .payment-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        .payment-table th {
            background-color: #eef2ff;
            font-weight: 600;
            color: #4338ca;
            border-radius: 5px 5px 0 0;
        }
        .payment-table tr:last-child td {
            border-bottom: none;
        }
        .amount-row td {
            font-weight: 700;
            font-size: 16px;
            border-top: 2px solid #e5e7eb;
            background-color: #eef2ff;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .status-paid {
            display: inline-block;
            padding: 6px 12px;
            background-color: #10b981;
            color: white;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
        }
        .status-pending {
            display: inline-block;
            padding: 6px 12px;
            background-color: #f59e0b;
            color: white;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
        }
        .contact-info {
            margin-top: 25px;
            font-size: 14px;
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 8px;
        }
        .qr-code {
            text-align: center;
            margin: 25px auto;
            background-color: white;
            padding: 15px;
            width: fit-content;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        .qr-code img {
            max-width: 150px;
            height: auto;
        }
        .stamp {
            position: absolute;
            top: 80px;
            right: 30px;
            transform: rotate(12deg);
            font-size: 42px;
            font-weight: bold;
            color: rgba(16, 185, 129, 0.25);
            border: 10px solid rgba(16, 185, 129, 0.25);
            padding: 10px 20px;
            border-radius: 10px;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 120px;
            color: rgba(0, 0, 0, 0.03);
            z-index: -1;
            white-space: nowrap;
        }
        .booking-details {
            margin: 5px 0;
            padding: 8px 12px;
            background-color: #f3f4f6;
            border-radius: 6px;
            font-size: 14px;
        }
        .booking-label {
            color: #6b7280;
            font-size: 13px;
            display: block;
            margin-bottom: 3px;
        }
        .price-breakdown {
            margin-top: 15px;
            border-top: 1px dashed #e5e7eb;
            padding-top: 15px;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .price-label {
            color: #6b7280;
        }
        .corner-accent {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            background-color: #1e40af;
            border-radius: 0 0 40px 0;
        }
        .corner-accent-bottom {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 40px;
            height: 40px;
            background-color: #1e40af;
            border-radius: 40px 0 0 0;
        }
        .thank-you-message {
            font-size: 18px;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .method-icon {
            font-size: 20px;
            margin-right: 5px;
            vertical-align: middle;
        }
        @media print {
            body {
                background-color: white;
            }
            .container {
                box-shadow: none;
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="corner-accent"></div>
        <div class="corner-accent-bottom"></div>
        <div class="watermark">LUNAS</div>
        @if($payment->status === 'paid')
        <div class="stamp">LUNAS</div>
        @endif
        
        <div class="header">
            <img src="{{ asset('images/logo.png') }}" alt="Logo" class="logo">
            <h1 class="receipt-title">BUKTI PEMBAYARAN</h1>
            <p class="receipt-subtitle">Layanan Ambulans Indonesia</p>
        </div>
        
        <div class="info-section">
            <div class="info-block">
                <h2 class="info-title">Informasi Pembayaran</h2>
                <div class="info-detail">
                    <span class="info-detail-label">Nomor Kwitansi</span>
                    <span class="info-detail-value">{{ $payment->transaction_id }}</span>
                </div>
                <div class="info-detail">
                    <span class="info-detail-label">Tanggal Pembayaran</span>
                    <span class="info-detail-value">{{ $payment->paid_at ? \Carbon\Carbon::parse($payment->paid_at)->isoFormat('D MMMM Y, HH:mm:ss') : 'Belum dibayar' }}</span>
                </div>
                <div class="info-detail">
                    <span class="info-detail-label">Metode Pembayaran</span>
                    <span class="info-detail-value">
                        @switch($payment->method)
                            @case('qris')
                                QRIS
                                @break
                            @case('va_bca')
                                Virtual Account BCA
                                @break
                            @case('va_mandiri')
                                Virtual Account Mandiri
                                @break
                            @case('va_bri')
                                Virtual Account BRI
                                @break
                            @case('va_bni')
                                Virtual Account BNI
                                @break
                            @case('gopay')
                                GoPay
                                @break
                            @default
                                {{ ucfirst(str_replace('_', ' ', $payment->method)) }}
                        @endswitch
                    </span>
                </div>
                <div class="info-detail">
                    <span class="info-detail-label">Status</span>
                    <span class="info-detail-value">
                        @if($payment->status === 'paid')
                            <span class="status-paid">LUNAS</span>
                        @else
                            <span class="status-pending">MENUNGGU</span>
                        @endif
                    </span>
                </div>
                @if($payment->va_number)
                <div class="info-detail">
                    <span class="info-detail-label">Nomor Virtual Account</span>
                    <span class="info-detail-value">{{ $payment->va_number }}</span>
                </div>
                @endif
            </div>
            
            <div class="info-block">
                <h2 class="info-title">Informasi Pelanggan</h2>
                <div class="info-detail">
                    <span class="info-detail-label">Nama Pasien</span>
                    <span class="info-detail-value">{{ $payment->booking->user->name ?? $payment->booking->passenger_name ?? 'Data tidak tersedia' }}</span>
                </div>
                <div class="info-detail">
                    <span class="info-detail-label">Email</span>
                    <span class="info-detail-value">{{ $payment->booking->user->email ?? 'Data tidak tersedia' }}</span>
                </div>
                <div class="info-detail">
                    <span class="info-detail-label">No. Telepon</span>
                    <span class="info-detail-value">{{ $payment->booking->passenger_phone ?? $payment->booking->user->phone ?? 'Data tidak tersedia' }}</span>
                </div>
                <div class="info-detail">
                    <span class="info-detail-label">ID Pemesanan</span>
                    <span class="info-detail-value">#{{ $payment->booking->id }}</span>
                </div>
            </div>
        </div>
        
        <div class="payment-details">
            <h2 class="info-title">Detail Pembayaran</h2>
            
            <div class="booking-details">
                <span class="booking-label">Tanggal Pemesanan</span>
                {{ $payment->booking->booking_time ? \Carbon\Carbon::parse($payment->booking->booking_time)->isoFormat('D MMMM Y, HH:mm') : \Carbon\Carbon::parse($payment->booking->created_at)->isoFormat('D MMMM Y, HH:mm') }}
                
                <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                    <div>
                        <span class="booking-label">Lokasi Penjemputan</span>
                        {{ $payment->booking->pickup_address ?? 'Data tidak tersedia' }}
                    </div>
                    <div>
                        <span class="booking-label">Lokasi Tujuan</span>
                        {{ $payment->booking->destination_address ?? 'Data tidak tersedia' }}
                    </div>
                </div>
                
                <div style="margin-top: 10px; display: flex; justify-content: space-between;">
                    <div>
                        <span class="booking-label">Jenis Ambulans</span>
                        {{ $payment->booking->ambulance->ambulance_type ?? 'Standar' }}
                    </div>
                    <div>
                        <span class="booking-label">Jarak Tempuh</span>
                        {{ $payment->booking->distance ?? '0' }} km
                    </div>
                </div>
            </div>
            
            <table class="payment-table">
                <thead>
                    <tr>
                        <th>Deskripsi</th>
                        <th>Tipe Pembayaran</th>
                        <th style="text-align: right;">Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            Layanan Ambulans<br>
                            <small>Pemesanan #{{ $payment->booking->id }}</small>
                        </td>
                        <td>{{ $payment->payment_type === 'downpayment' ? 'Uang Muka' : 'Pembayaran Penuh' }}</td>
                        <td style="text-align: right;">Rp {{ number_format($payment->amount, 0, ',', '.') }}</td>
                    </tr>
                    @if($payment->payment_type === 'downpayment')
                    <tr>
                        <td colspan="2">
                            <small>Uang muka sebesar {{ $payment->downpayment_percentage }}% dari total biaya</small>
                        </td>
                        <td></td>
                    </tr>
                    @endif
                    
                    <tr>
                        <td colspan="3">
                            <div class="price-breakdown">
                                @php
                                    $baseAmount = round($payment->amount * 0.8);
                                    $tax = $payment->amount - $baseAmount;
                                @endphp
                                <div class="price-row">
                                    <span class="price-label">Biaya Dasar</span>
                                    <span>Rp {{ number_format($baseAmount, 0, ',', '.') }}</span>
                                </div>
                                <div class="price-row">
                                    <span class="price-label">Pajak dan Biaya Layanan (20%)</span>
                                    <span>Rp {{ number_format($tax, 0, ',', '.') }}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <tr class="amount-row">
                        <td colspan="2"><strong>Total Pembayaran</strong></td>
                        <td style="text-align: right;"><strong>Rp {{ number_format($payment->amount, 0, ',', '.') }}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        @if($payment->qr_code)
        <div class="qr-code">
            <img src="{{ $payment->qr_code }}" alt="QR Code">
            <p>Scan QR Code ini untuk verifikasi pembayaran</p>
        </div>
        @endif
        
        <div class="footer">
            <p class="thank-you-message">Terima Kasih Atas Kepercayaan Anda</p>
            <p>Dokumen ini adalah bukti pembayaran resmi untuk layanan ambulans Anda.</p>
            <p>Jika Anda memiliki pertanyaan, silakan hubungi tim dukungan kami.</p>
            
            <div class="contact-info">
                <p><strong>Layanan Ambulans Indonesia</strong></p>
                <p>Email: bantuan@ambulans.id | Telepon: +62 21 5678 9012</p>
                <p>Jl. Kesehatan No. 123, Jakarta 12345, Indonesia</p>
            </div>
        </div>
    </div>
</body>
</html>
