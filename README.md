# Toko Buku Kehidupan - Aplikasi Pemesanan Buku

## Deskripsi
Aplikasi web sederhana untuk pemesanan buku pada toko online. Fokus pada **front-end** saja: tidak ada server atau database, semua data diambil dari variabel array di `js/data.js`.

## Teknologi
- **HTML5**: struktur halaman dengan tag semantik (`header`, `nav`, `main`, `section`, `footer`)
- **CSS3**: satu file eksternal, variabel warna, flexbox dan grid, responsif
- **JavaScript**: manipulasi DOM, validasi form, alert dan modal, `sessionStorage`


```

## Fitur per Halaman
| Halaman | Fitur |
|---|---|
| **Login** (`index.html`) | Login dengan validasi email dan password, alert jika salah, modal *Lupa Password* dan *Daftar* |
| **Dashboard** (`dashboard.html`) | Greeting sesuai jam (pagi/siang/sore/malam), 4 menu navigasi, modal History Transaksi |
| **Stok** (`stok.html`) | Tabel katalog dinamis dari `dataKatalogBuku`, tambah stok baru, hapus buku, tombol Pesan |
| **Pemesanan** (`checkout.html`) | Tambah, ubah jumlah, dan hapus pesanan, total otomatis, form pemesan dan pembayaran dengan validasi |
| **Tracking** (`tracking.html`) | Cari nomor DO, tampil nama pemesan, status, progress bar, detail ekspedisi, dan timeline perjalanan |

## Alur Kerja Singkat
1. User login, data user disimpan di `sessionStorage`.
2. Di Dashboard, user memilih menu.
3. Di Stok, user melihat katalog dan menekan **Pesan** untuk memasukkan buku ke keranjang.
4. Di Pemesanan, user mengecek keranjang, mengisi data, lalu membuat pesanan.
5. Di Tracking, user memantau pengiriman dengan nomor DO.

## Penjelasan Kode Utama
- **`data.js`**: `dataPengguna` (akun), `dataKatalogBuku` (buku), `dataTracking` (pengiriman).
- **`script.js`** dibagi per halaman: `initLogin`, `initDashboard`, `initStok`, `initCheckout`, `initTracking`. Fungsi yang dijalankan dipilih berdasarkan `id` pada tag `<body>`.
- **Fungsi bantu**: `formatRupiah`, `angkaDariHarga`, `bukaModal`/`tutupModal`, `cekLogin`.
- **Proteksi halaman**: semua halaman selain login memanggil `cekLogin()`.

## Validasi Form
- Kolom wajib tidak boleh kosong (login, daftar, tambah stok, checkout)
- Format email divalidasi, password daftar minimal 6 karakter
- Email dan kode barang tidak boleh duplikat
- Stok dan harga tidak boleh negatif
- Nomor HP harus 10-13 digit angka
- Pesan error ditampilkan lewat alert atau teks merah di bawah form

## Kesesuaian dengan Kriteria Penilaian
| Kriteria | Penerapan |
|---|---|
| Struktur HTML | Tag semantik, `label` terhubung ke input, 5 halaman lengkap |
| Desain CSS | File eksternal, tema biru-hijau, responsif |
| JavaScript DOM | Tabel dibuat dengan `createElement`, tambah/hapus/ubah data |
| Validasi dan alert | Alert, modal, dan pesan error di setiap form |
| Modularitas | HTML, CSS, JS, data, dan gambar dipisah per folder |
| Kreativitas | Progress bar dan timeline tracking, keranjang, history transaksi |

## Cara Menjalankan
1. Ekstrak folder project.
2. Buka `index.html` di browser (tidak perlu server).
3. Login dengan akun uji:
   - `rina@gmail.com` / `rina123` (User)
   - `siti@gmail.com` / `siti123` (Admin)
4. Nomor DO untuk uji tracking: `20230012` dan `20230013`.

## Link Youtube
https://youtu.be/Zx0xd63aWgA?si=pVhnaBX-sBGfvqgk
