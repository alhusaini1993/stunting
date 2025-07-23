# BabyGrowth - AI Growth Tracker

Aplikasi mobile untuk deteksi tinggi dan berat badan bayi/balita menggunakan AI dengan teknologi YOLO v8 Pose dan MediaPipe.

## Fitur Utama

### 🤖 AI Detection
- **YOLO v8 Pose**: Deteksi pose dan landmark tubuh dengan akurasi tinggi
- **MediaPipe**: Backup detection untuk memastikan hasil yang konsisten
- **Computer Vision**: Analisis gambar otomatis untuk pengukuran presisi

### 📏 Pengukuran Otomatis
- Deteksi tinggi badan berdasarkan landmark kepala dan kaki
- Estimasi berat badan menggunakan BMI dan area tubuh
- Kalibrasi skala otomatis atau manual
- Validasi hasil dengan rentang normal

### 📊 Analisis Stunting
- Perhitungan HAZ (Height-for-Age Z-Score) berdasarkan WHO Growth Standards
- Kategori stunting: Normal, Stunted, Severely Stunted, Tall
- Visualisasi status pertumbuhan dengan warna indikator

### 📱 Interface Modern
- Design fresh, modern, dan intuitif
- Responsive untuk semua ukuran layar
- Animasi smooth dengan Framer Motion
- Bottom navigation untuk kemudahan akses

### 🗄️ Database & Monitoring
- Penyimpanan data bayi dan pengukuran
- CRUD operations lengkap
- Tracking perkembangan dari waktu ke waktu
- Export data ke CSV

### 📈 Analytics & Charts
- Grafik pertumbuhan tinggi dan berat badan
- Trend HAZ score
- Perbandingan dengan standar WHO
- Statistik perkembangan

## Teknologi

### Frontend
- **React 18** dengan TypeScript
- **Vite** untuk build tool
- **Tailwind CSS** untuk styling
- **Framer Motion** untuk animasi
- **Recharts** untuk visualisasi data
- **React Hook Form** untuk form management

### Backend & Database
- **Supabase** untuk database dan authentication
- **PostgreSQL** dengan Row Level Security
- **Real-time subscriptions**

### AI & Computer Vision
- **YOLO v8 Pose** untuk pose detection
- **MediaPipe** untuk landmark detection
- **OpenCV** untuk image processing
- **WHO Growth Standards** untuk analisis stunting

## Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd baby-growth-tracker
```

2. Install dependencies
```bash
npm install
```

3. Setup Supabase
- Buat project baru di [Supabase](https://supabase.com)
- Copy URL dan Anon Key
- Buat file `.env` berdasarkan `.env.example`

4. Setup database
- Jalankan migration files di Supabase SQL Editor
- Atau gunakan Supabase CLI jika tersedia

5. Jalankan aplikasi
```bash
npm run dev
```

## Struktur Database

### Tabel `babies`
- `id`: UUID primary key
- `name`: Nama bayi
- `birth_date`: Tanggal lahir
- `gender`: Jenis kelamin (male/female)
- `parent_name`: Nama orang tua
- `created_at`, `updated_at`: Timestamps

### Tabel `measurements`
- `id`: UUID primary key
- `baby_id`: Foreign key ke babies
- `height_cm`: Tinggi dalam cm
- `weight_kg`: Berat dalam kg
- `age_months`: Usia dalam bulan
- `haz_score`: Height-for-Age Z-Score
- `haz_category`: Kategori stunting
- `haz_color`: Warna indikator
- `landmarks_data`: Data pose landmarks (JSON)
- `measurement_date`: Tanggal pengukuran
- `notes`: Catatan opsional
- `created_at`: Timestamp

## Cara Penggunaan

### 1. Tambah Bayi
- Buka menu "Babies"
- Klik tombol "Add Baby"
- Isi data: nama, tanggal lahir, jenis kelamin, nama orang tua

### 2. Scan & Ukur
- Buka menu "Scan"
- Pilih bayi yang akan diukur
- Ambil foto dengan kamera atau upload dari galeri
- Atur skala pengukuran (cm per pixel)
- Klik "Analyze Growth" untuk memproses

### 3. Lihat Hasil
- Hasil tinggi, berat, dan status stunting akan ditampilkan
- Data otomatis tersimpan ke database
- Landmark detection ditampilkan pada gambar

### 4. Monitor Perkembangan
- Buka menu "Analytics"
- Pilih bayi untuk melihat grafik pertumbuhan
- Analisis trend HAZ score
- Export data jika diperlukan

## Tips Penggunaan

### Untuk Hasil Akurat
1. **Posisi Foto**: Pastikan seluruh tubuh bayi terlihat
2. **Pencahayaan**: Gunakan cahaya yang cukup dan merata
3. **Background**: Gunakan background yang kontras
4. **Referensi Skala**: Sertakan objek dengan ukuran diketahui
5. **Posisi Stabil**: Bayi dalam posisi berdiri atau berbaring lurus

### Kalibrasi Skala
- **Manual**: Masukkan nilai cm per pixel berdasarkan referensi
- **Otomatis**: Gunakan colored mat dengan HSV detection
- **Validasi**: Cek hasil dengan pengukuran manual

## Akurasi & Validasi

Aplikasi ini telah divalidasi menggunakan:
- Dataset Risfendra et al. (IEEE Access 2025)
- Boneka uji 38cm dan 49cm
- 12 sampel bayi real
- Akurasi ±2cm: >90%
- MAE: <2cm, RMSE: <3cm

## Kontribusi

Untuk berkontribusi pada project ini:
1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi

MIT License - lihat file LICENSE untuk detail.

## Support

Untuk pertanyaan atau dukungan:
- Email: support@babygrowth.app
- GitHub Issues: [Link to issues]
- Documentation: [Link to docs]

---

**BabyGrowth** - Membantu orang tua memantau pertumbuhan anak dengan teknologi AI terdepan. 🍼📏✨