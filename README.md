# SIAKAD SMA Pemberdayaan Bangsa

Frontend demo Sistem Informasi Akademik untuk SMA Pemberdayaan Bangsa, Ngrayun, Ponorogo. Dibuat dengan HTML, CSS, dan JavaScript tanpa framework.

## Menjalankan

1. Letakkan folder project di `C:\xampp\htdocs\ui ux siakad`.
2. Jalankan Apache dari XAMPP.
3. Buka `http://localhost/ui%20ux%20siakad/` untuk Developer Control Center.
4. Buka `http://localhost/ui%20ux%20siakad/pages/beranda.html` untuk landing page sekolah.

Tidak ada proses build atau instalasi dependency untuk versi frontend ini.

## Halaman

- `index.html`: Developer Control Center untuk role, permission, feature, konfigurasi, audit, dan backup demo.
- `pages/beranda.html`: landing page sekolah dan portal akademik terpadu.
- `pages/dashboard.html`: dashboard akademik mandiri.
- `pages/siswa.html`, `guru.html`, `kelas.html`, `mapel.html`, `jadwal.html`, `nilai.html`, `pendaftaran.html`, dan `pengumuman.html`: modul data akademik.
- `pages/absensi.html` dan `pages/ujian.html`: simulasi alur absensi dan ujian.

## Struktur

- `assets/css/`: stylesheet landing, dashboard, dan modul.
- `assets/js/core/`: runtime bersama untuk halaman akademik.
- `assets/js/pages/`: interaksi spesifik setiap modul.
- `colors.css` dan `style.css`: palet hijau dan stylesheet Developer Control Center.
- `Laporan/`: dokumen proposal lokal; dokumen identitas pribadi tidak untuk dipublikasikan.

## Batasan Demo

Data CRUD disimpan pada `localStorage` browser. Face scan, liveness, geofence, validasi Wi-Fi, device binding, waktu server, dan pengawasan ujian hanya simulasi UI; fitur tersebut belum memberikan verifikasi atau keamanan produksi. Implementasi nyata memerlukan backend, autentikasi, database, dan validasi server.
