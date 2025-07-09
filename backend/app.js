const express = require('express');
const cors = require('cors'); // Mengimpor modul CORS untuk mengizinkan permintaan lintas-origin

// Memanggil file konfigurasi database.
// Ini akan menginisialisasi koneksi database saat aplikasi backend dimulai.
require('./config/db');

// Mengimpor definisi rute untuk pesanan (orders) dan layanan (services)
const orderRoutes = require('./routes/orderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const notaRoutes = require('./routes/notaRoutes'); // Import rute baru untuk nota

const app = express(); // Membuat instance aplikasi Express
const PORT = 3001; // Menentukan port di mana server backend akan berjalan

// --- Middleware ---
// Mengaktifkan middleware CORS. Ini sangat penting agar frontend (yang mungkin berjalan di port 3000)
// dapat berkomunikasi dengan backend (yang berjalan di port 3001).
app.use(cors());

// Mengaktifkan middleware express.json() untuk mengurai (parse) body permintaan
// yang datang dalam format JSON. Ini memungkinkan Anda mengakses data yang dikirim
// dari frontend melalui `req.body`.
app.use(express.json());

// --- Definisi Rute API ---
// Mengarahkan semua permintaan yang dimulai dengan '/api/orders'
// ke modul rute `orderRoutes`.
app.use('/api/orders', orderRoutes);

// Mengarahkan semua permintaan yang dimulai dengan '/api/services'
// ke modul rute `serviceRoutes`. Ini akan digunakan untuk mengambil daftar
// layanan dan harga yang ditampilkan di frontend.
app.use('/api/services', serviceRoutes);

// Mengarahkan semua permintaan yang dimulai dengan '/api/nota'
// ke modul rute `notaRoutes`. Ini akan digunakan untuk membuat dan mengirim nota.
app.use('/api/nota', notaRoutes); // Tambahkan rute baru ini

// --- Middleware Penanganan Error ---
// Ini adalah middleware penanganan error dasar. Jika ada error yang terjadi
// di rute atau middleware sebelumnya dan tidak tertangkap, error akan
// diteruskan ke middleware ini.
app.use((err, req, res, next) => {
  // Mencetak stack trace error ke konsol server untuk tujuan debugging
  console.error(err.stack);
  // Mengirim respons error dengan status 500 (Internal Server Error)
  // dan pesan generik ke klien.
  res.status(500).send('Terjadi kesalahan pada server!');
});

// --- Menjalankan Server ---
// Server Express mulai mendengarkan (listen) pada port yang telah ditentukan.
// Setelah server berhasil berjalan, pesan akan dicetak ke konsol.
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
