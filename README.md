<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Ambulance Portal

Ambulance Portal adalah aplikasi manajemen ambulans yang dibangun dengan Laravel. Aplikasi ini memungkinkan pengguna untuk memesan ambulans, melacak lokasi ambulans, dan mengelola pembayaran.

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Deployment

### Persyaratan Sistem

- Docker dan Docker Compose
- Minimal 2GB RAM
- 20GB ruang disk
- Koneksi internet

### Langkah Deployment

1. Clone repository ini
2. Salin `.env.example` ke `.env` dan sesuaikan konfigurasi
3. Jalankan script deployment:

```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

Script ini akan:
- Memperbarui paket sistem
- Menginstal Docker dan Docker Compose (jika belum ada)
- Membuat sertifikat SSL self-signed
- Menyiapkan direktori yang diperlukan
- Membuat file `.env` jika belum ada
- Membangun dan menjalankan container Docker
- Menyiapkan cron job untuk backup database

### Setup SSL (Opsional untuk Produksi)

Untuk lingkungan produksi, disarankan menggunakan sertifikat SSL dari Let's Encrypt:

```bash
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
```

Pilih opsi 2 untuk mengatur sertifikat Let's Encrypt.

## Manajemen Aplikasi

### Melihat Log

```bash
docker-compose logs -f
```

### Restart Layanan

```bash
docker-compose restart
```

### Menghentikan Aplikasi

```bash
docker-compose down
```

### Menjalankan Aplikasi

```bash
docker-compose up -d
```

## Backup dan Restore Database

Gunakan script `backup-restore.sh` untuk mengelola backup database:

```bash
chmod +x backup-restore.sh
sudo ./backup-restore.sh
```

Script ini menyediakan opsi untuk:
1. Membuat backup baru
2. Melihat daftar backup yang tersedia
3. Memulihkan dari backup
4. Membersihkan backup lama

## Pemecahan Masalah

### Masalah Koneksi Database

Jika aplikasi tidak dapat terhubung ke database:

```bash
docker-compose restart db
docker-compose restart app
```

### Masalah Izin File

Jika ada masalah izin file:

```bash
docker exec -it ambulance_app bash -c "chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache"
```

### Memeriksa Status Container

```bash
docker-compose ps
```

### Memeriksa Log Aplikasi

```bash
docker exec -it ambulance_app bash -c "tail -f /var/www/storage/logs/laravel.log"
```
