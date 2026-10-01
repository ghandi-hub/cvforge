# CVForge — ATS CV Builder & Cover Letter Generator

Aplikasi pembuat Curriculum Vitae (CV) dan Surat Lamaran (Cover Letter) berbasis web yang berfokus pada keterbacaan Applicant Tracking System (ATS), data terstruktur, dan analisis kecocokan kata kunci Job Description secara deterministik.

Menggunakan visual style **Neo-Brutalism**: layout tegas, kontras tinggi, border tebal, hard shadow, dan fungsional.

---

## Fitur Utama

- **Data CV Terstruktur**: Data riwayat kerja, pendidikan, skill, dan proyek tersimpan dalam format terstruktur dan reusable. Ganti template tanpa input ulang.
- **3 Template ATS-Friendly**:
  - `ATS Classic`: Format single-column formal berbasis font serif, bersih tanpa elemen dekoratif.
  - `ATS Modern`: Layout modern sans-serif dengan hirarki visual rapi dan minimalis.
  - `ATS Brutalist`: Desain kotak bergaris tegas bernuansa developer tool, tetap mudah diparsing mesin ATS.
- **Deterministic ATS Keyword Scanner**:
  - Input Job Description dari lowongan pekerjaan.
  - Normalisasi teks dan ekstraksi kata kunci teknis berbasis kamus (bahasa pemrograman, framework, database, cloud, devops, tools).
  - Evaluasi kecocokan keyword terhadap isi CV (*FOUND* vs *MISSING*).
  - Audit kelengkapan struktur dokumen (kontak, pengalaman, pendidikan, skill).
- **Cover Letter Generator Terintegrasi**:
  - Menyusun surat lamaran profesional secara instan tersinkronisasi dari profil CV (pengalaman terbaru, proyek unggulan, keahlian utama) dan target perusahaan/role.
  - 3 pilihan nada bahasa: Formal (BUMN/Korporat), Modern (Startup/Tech), dan Professional English (Global ATS).
  - Editor teks interaktif dengan live autosave ke database dan tombol salin ke clipboard.
  - Pratinjau A4 responsif dan ekspor cetak PDF mandiri berstandar 1:1.
- **Ekspor PDF Terisolasi & Saling-Eksklusif (A4 Standard)**:
  - Output A4 proporsional dengan selectable text (bukan screenshot raster).
  - Menggunakan engine cetak terisolasi (`print root`), cetak CV hanya mengeluarkan dokumen CV, dan cetak Surat Lamaran hanya mengeluarkan surat lamaran.
  - Dilengkapi CSS print hardening (`@page`, `break-inside: avoid`).
- **UI Responsif Mobile-Optimized**:
  - Tampilan mobile ramping dengan navigasi 3 tab: `[ FORM CV ]`, `[ SURAT ]`, dan `[ ATS ]`.
  - Floating action button untuk akses cepat pratinjau A4 dan ekspor PDF.
  - Fullscreen overlay pratinjau dokumen di layar kecil tanpa merusak layout form.
- **Autosave & Section Reordering**:
  - Autosave otomatis dengan mekanisme debouncing.
  - Fitur ubah urutan section (naik/turun) yang tersimpan ke database.
- **Manajemen Banyak CV**:
  - Dashboard untuk membuat, mengedit, menduplikasi, dan menghapus CV.
  - Isolasi data per pengguna (*ownership-based access control*).
- **Autentikasi Aman**:
  - Google OAuth 2.0.
  - Session cookie HMAC SHA-256 (`timingSafeEqual`).

---

## Tech Stack

- **Framework**: SvelteKit 2 (TypeScript)
- **Runtime & Package Manager**: Bun
- **Styling**: Tailwind CSS v4 (Neo-Brutalist Design Tokens)
- **Database**: MongoDB
- **Validasi Data**: Zod
- **Icons**: Lucide Svelte
- **Containerization**: Docker & Docker Compose (Multi-stage build)

---

## Prasyarat

- [Bun](https://bun.sh/) (v1.1+ direkomendasikan) atau [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/) (lokal atau via Docker container)
- Akun Google Cloud Console untuk OAuth 2.0 (Web Application)

---

## Konfigurasi Environment

Salin file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Sesuaikan variabel di dalam `.env`:

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database MongoDB
MONGODB_URI=mongodb://user:password@mongodb:27017/cvforge?authSource=admin
MONGODB_DB_NAME=cvforge

# Kunci Rahasia Sesi (Minimal 32 karakter acak)
AUTH_SECRET=your-random-session-secret-key-min-32-chars-long

# Google OAuth (Tipe: Web Application)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Domain Aplikasi
ORIGIN=https://cvforge.domainanda.com
PUBLIC_APP_URL=https://cvforge.domainanda.com
```

### Konfigurasi Google Cloud Console:
- **Tipe Kredensial**: OAuth 2.0 Client ID -> *Web application*
- **Authorized JavaScript origins**: `https://cvforge.domainanda.com` (atau `http://localhost:3000` untuk dev)
- **Authorized redirect URIs**: `https://cvforge.domainanda.com/auth/google/callback`

---

## Menjalankan dengan Bun (Lokal)

1. Pasang dependensi:
   ```bash
   bun install
   ```

2. Jalankan development server:
   ```bash
   bun run dev
   ```
   Buka `http://localhost:5173` di browser.

3. Build dan jalankan mode produksi:
   ```bash
   bun run build
   bun build/index.js
   ```

---

## Menjalankan dengan Docker

Proyek ini sudah dilengkapi `Dockerfile` multi-stage dan `docker-compose.yml`.

1. Jalankan container:
   ```bash
   docker compose up -d --build
   ```

2. Cek status container:
   ```bash
   docker compose ps
   docker compose logs -f app
   ```

Aplikasi default berjalan di port host `3001` (diteruskan ke port container `3000`).

---

## Struktur Direktori

```text
cvforge/
├── src/
│   ├── lib/
│   │   ├── ats/                   # Logika scanner keyword & normalisasi teks
│   │   ├── cover-letter/          # Mesin generator narasi surat lamaran
│   │   ├── components/            # Komponen UI & template
│   │   │   ├── templates/         # Template ATS (Classic, Modern, Brutalist)
│   │   │   ├── CvRenderer.svelte  # Engine rendering pratinjau & salinan cetak CV A4
│   │   │   └── CoverLetterRenderer.svelte # Engine rendering surat lamaran A4
│   │   ├── server/                # Koneksi DB, session helper, & CRUD resume
│   │   ├── types/                 # Skema Zod & tipe data TypeScript
│   │   └── print.css              # Stylesheet isolasi cetak / ekspor PDF
│   ├── routes/
│   │   ├── +page.svelte           # Landing page publik
│   │   ├── login/                 # Halaman autentikasi
│   │   ├── dashboard/             # Manajemen daftar resume pengguna
│   │   ├── editor/[id]/           # Editor form, live preview, cover letter, & ATS analyzer
│   │   ├── auth/google/           # Endpoint OAuth flow & callback
│   │   └── api/                   # REST endpoint (resumes CRUD, cover-letter, & ATS scanner)
│   ├── app.css                    # Setup Tailwind & token desain Neo-Brutalism
│   └── hooks.server.ts            # Session validation & security headers
├── Dockerfile                     # Multi-stage Bun build
├── docker-compose.yml             # Orkestrasi container
└── .env.example                   # Template konfigurasi environment
```

---

## Panduan Ekspor PDF Terbaik

Saat melakukan cetak/ekspor PDF dari browser:
- Pilih printer target: **Save as PDF** / **Simpan sebagai PDF**.
- Ukuran Kertas: **A4**.
- Margin: **None** (Nol).
- Centang opsi: **Background graphics** / **Grafik latar belakang** (agar warna aksen dan border tampil utuh).

---

## Lisensi

Didistribusikan di bawah lisensi MIT.
