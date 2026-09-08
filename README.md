# STKI Analyzer 🔍

> **Sistem Temu Kembali Informasi & Text Mining Pre-processing Lab**  
> Aplikasi web interaktif berbasis Next.js 16 dan React 19 untuk eksplorasi dan visualisasi langkah demi langkah (end-to-end) pra-pemrosesan teks Bahasa Indonesia, pembobotan TF-IDF, inverted index, uji temu kembali (search engine), serta evaluasi studi kasus.

---

## 📌 Ringkasan Proyek

**STKI Analyzer** dirancang untuk kebutuhan akademik dan eksperimen text mining dalam mata kuliah Sistem Temu Kembali Informasi (STKI). Seluruh algoritma berjalan secara deterministik di sisi klien (client-side), memungkinkan visualisasi perubahan bentuk data secara transparan mulai dari teks mentah hingga perankingan dokumen.

---

## ✨ Fitur Utama

Aplikasi terbagi menjadi **11 modul tahapan terpadu**:

| Langkah | Modul | Deskripsi Singkat |
| :---: | :--- | :--- |
| **01** | **Dokumen (Raw Data)** | Pengumpulan data mentah teks asli dokumen via upload multi-file `.txt` atau input langsung. |
| **02** | **Parsing** | Pembersihan struktur teks dari tag HTML/markup, kanonisasi newline `\r\n`, dan normalisasi whitespace. |
| **03** | **Analisis Leksikal** | Transformasi case folding (penyeragaman huruf kecil), pembersihan simbol/angka non-huruf, dan pemotongan token kata. |
| **04** | **Penghapusan Stopword** | Penyaringan kata umum/tugas berbasis kamus 93+ stopword Bahasa Indonesia untuk mereduksi entropi dan volume indeks. |
| **05** | **Deteksi Frasa** | Pengenalan Multi-Word Expression (MWE) domain-spesifik (contoh: *bola voli*, *pendidikan jasmani*) menggunakan boundary regex `\b`. |
| **06** | **Stemming & Lematisasi** | Normalisasi morfologi aglutinatif Indonesia (pemotongan prefiks, sufiks, klitik, dan lematisasi bentuk tidak beraturan). |
| **07** | **Pembobotan (TF-IDF)** | Kalkulasi matriks bobot Term Frequency - Inverse Document Frequency ($w = \text{TF} \times \text{IDF}$) antar dokumen. |
| **08** | **Pengindeksan** | Pembangunan struktur data Inverted Index (pemetaan Kata $\rightarrow$ Dokumen & Posting List berbobot) untuk waktu temu kembali $O(1)$. |
| **09** | **Uji Pencarian** | Mesin pencari kueri terintegrasi dengan normalisasi kueri, prefix/partial match kueri (contoh: ketik `pro` menemukan `proliga`), akumulasi skor bobot relevansi, dan visualisasi gelembung kata kunci cocok. |
| **10** | **Studi Kasus** | Analisis komparasi end-to-end berdampingan pada korpus nyata: Isi Dokumen, Tokenisasi, Filtering, dan Stemming. Mendukung upload multi-dokumen sekaligus. |
| **11** | **Pre-processing Lab** | Simulator eksplorasi interaktif 5 tahapan NLP wajib (Case Folding, Cleaning, Tokenization, Stopword Removal, Stemming) dengan 5 dataset teks kompleks, log audit trail otomatis (*data sebelum, proses, data sesudah*), dan visualisasi perubahan kata. |

---

## 📄 Fitur Ekspor Dokumen PDF

Setiap halaman (Langkah 1 hingga 11) dilengkapi tombol **"Download PDF Hasil"**:
- **Unduh Langsung File `.pdf`**: Tanpa membuka print preview browser, file PDF otomatis tersimpan ke storage lokal pengguna via `jspdf` & `jspdf-autotable`.
- **Desain Laporan Resmi**: Dilengkapi banner gradien hijau STKI Analyzer, cap tanggal & waktu eksekusi (WIB), penomoran halaman otomatis, dan footer audit.
- **Visualisasi Gelembung (Badge Rounded-Pill)**: Token kata pada kolom Tokenisasi, Filtering, dan Stemming tetap dirender di dalam kapsul gelembung bulat berwarna sesuai antarmuka web.
- **Multi-Page Break Terstruktur**: Baris atau token panjang otomatis berlanjut ke halaman berikutnya tanpa teks terpotong atau terduplikasi.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library UI**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Ekspor PDF**: [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18.18 atau lebih baru
- `npm` atau package manager alternatif (`pnpm` / `yarn`)

### 2. Instalasi Dependensi
```bash
git clone https://github.com/AhmadDhaby19/stki-analyzer.git
cd stki-analyzer
npm install
```

### 3. Mode Pengembangan (Development)
Jalankan server pengembangan lokal:
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

### 4. Build untuk Produksi (Production)
```bash
npm run build
npm run start
```

---

## 🧪 Metrik & Algoritma Utama

1. **Pembersihan Regulasi (Regex Cleansing)**:
   - Penghapusan tag: `/<[^>]+>/g`
   - Pembersihan simbol: `/[^a-z\s]/g`
2. **Kamus Stopword**:
   - Berisi 93+ kata tugas Bahasa Indonesia (preposisi, konjungsi, partikel, pronomina).
3. **Pembobotan TF-IDF**:
   $$\text{TF}(t, d) = \frac{\text{count}(t, d)}{|d|}$$
   $$\text{IDF}(t) = \ln\left(1 + \frac{N}{\text{df}(t)}\right)$$
   $$\text{Score}(t, d) = \text{TF}(t, d) \times \text{IDF}(t)$$
4. **Perankingan Kueri**:
   $$\text{Score}(d, q) = \sum_{t \in \text{Stem}(q) \cap d} w(t, d)$$
