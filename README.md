# SIKIA — Sistem Informasi Kesehatan Ibu dan Anak Desa Manud Jaya
> **Magister Teknologi Informasi (MTI) UI — CSIM801023 Dinamika Tim Perangkat Lunak (DTPL)**  
> **Kelompok / Tim**: Tim 03  
> **Studi Kasus**: Layanan Posyandu Terintegrasi Desa Manud Jaya  

---

## 📌 Deskripsi Proyek
**SIKIA (Sistem Informasi Kesehatan Ibu dan Anak)** adalah platform digital posyandu berbasis web yang dirancang untuk mendigitalkan pencatatan layanan kesehatan, pendaftaran kunjungan, pemantauan status kehadiran, serta manajemen data peserta (Ibu Hamil, Balita, dan Bayi) di lingkungan Desa Manud Jaya.

Sistem ini mendukung peran multi-pengguna:
- **Kader Posyandu**: Pencatatan kunjungan, verifikasi kehadiran, dan pemantauan riwayat kesehatan warga.
- **Bidan Desa**: Akses data medis, evaluasi kesehatan ibu & anak, dan catatan observasi.
- **Super Administrator**: Manajemen akun, penugasan kader posyandu per dusun, dan operasional sistem.
- **Ibu Peserta**: Akses riwayat kunjungan dan data kesehatan pribadi serta anak.

---

## 🌐 Tautan Deployment
Platform ini menerapkan pipeline deployment otomatis melalui Vercel:

| Lingkungan | URL | Branch Git | Keterangan |
| :--- | :--- | :--- | :--- |
| **Production** | [posyandu-manudjaya-tim03.vercel.app](https://posyandu-manudjaya-tim03.vercel.app/) | `main` | Versi stabil teruji untuk stakeholder |
| **Staging** | [staging-posyandu-manudjaya-tim03.vercel.app](https://staging-posyandu-manudjaya-tim03.vercel.app/) | `staging` | Lingkungan integrasi, sprint increment, & QA |

---

## 🚀 Fitur Utama

1. **Dashboard & Analitik Operasional Posyandu**
   - Ringkasan metrik statistik kehadiran harian, jumlah ibu hamil, balita, dan bayi.
   - Tabel monitoring kehadiran real-time hari ini dengan penanda waktu.
2. **PBI-03: Registrasi & Pendaftaran Kunjungan (Multi-Step Wizard)**
   - *Step 1*: Pencarian peserta atau registrasi peserta baru serta penentuan jadwal/posyandu penugasan.
   - *Step 2*: Pemilihan layanan terintegrasi (Pelayanan Dasar & Pelayanan Khusus Ibu Hamil).
   - *Step 3*: Pembaruan status kehadiran.
   - *Step 4*: Konfirmasi ringkasan pendaftaran.
3. **Data Peserta & Rekam Medis Ringkas**
   - Pencarian berbasis Nama, NIK (dengan opsi proteksi privasi / masking), dan Nomor KK.
   - Filter dinamis berdasarkan Dusun/Wilayah (relasi master database) dan kategori peserta.
   - Formulir detail dan update data peserta.
4. **Riwayat Kunjungan & Cetak Hasil Pemeriksaan**
   - Log histori pemeriksaan lengkap peserta.
   - Modal detail hasil pemeriksaan fisik (BB, TB, tensi, lingkar lengan, usia kehamilan, vitamin/tablet Fe).
   - Dukungan cetak rapi (*print layout optimization*) tanpa terpotong.
5. **Kelola Kader & Petugas (Super Admin)**
   - Manajemen kader posyandu dengan penugasan per wilayah Dusun.
   - Fitur aktifkan/nonaktifkan status operasional kader serta penangguhan akun (*soft delete*).

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend**:
  - [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
  - [Tailwind CSS v3](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (Icons)
- **Backend & Database**:
  - [Supabase](https://supabase.com/) (PostgreSQL Relasional)
  - Row-Level Security & Normalisasi Skema Database dengan UUID (*Foreign Keys*):
    - `dusun`, `posyandu`, `roles`, `tipe_peserta`, `kategori_pelayanan`, `jenis_pelayanan`
    - Relasi transaksi: `peserta`, `kader`, `kunjungan`, `kunjungan_pelayanan`
- **Hosting & CI/CD**:
  - [Vercel](https://vercel.com/) (Automatic Git Branch Deployments & SPA Rewrites)

---

## 💻 Panduan Instalasi Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18+ disarankan)
- Package manager: `npm` atau `pnpm`

### Langkah-langkah
1. **Clone repositori**:
   ```bash
   git clone https://github.com/miahljnh97/sikia-manudjaya.git
   cd sikia-manudjaya
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Buat file `.env` di root direktori proyek:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Jalankan local development server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada `http://localhost:5173/`.

5. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

---

## 🌿 Standar Branching & Kolaborasi

Proyek ini menerapkan standar branching berbasis GitFlow sederhana:
- **`main`**: Mencerminkan kode produksi yang stabil (*live production*).
- **`staging`**: Branch utama untuk *active development* dalam sprint berjalan, pengujian QA, dan integrasi fitur baru sebelum perilisan.

---

## 👥 Tim Pengembang (Tim 03 DTPL MTI UI)
- **Mata Kuliah**: Dinamika Tim Perangkat Lunak (CSIM801023)
- **Program Studi**: Magister Teknologi Informasi, Fakultas Ilmu Komputer, Universitas Indonesia
