const mysql = require('mysql2/promise'); // Mengimpor modul mysql2 dengan dukungan Promise

// Membuat pool koneksi database. Pool ini akan mengelola beberapa koneksi
// ke database secara efisien, sehingga tidak perlu membuat koneksi baru
// untuk setiap permintaan.
const pool = mysql.createPool({
  host: 'localhost', // Alamat host database Anda (biasanya 'localhost' untuk pengembangan lokal)
  user: 'root',      // Nama pengguna database MySQL Anda (ganti jika berbeda)
  password: '',      // Kata sandi database MySQL Anda (ganti jika Anda memiliki kata sandi)
  database: 'essentials_shoes_db', // Nama database yang telah Anda buat
  waitForConnections: true, // Menentukan apakah pool akan menunggu koneksi tersedia saat semua koneksi sedang digunakan
  connectionLimit: 10,      // Jumlah maksimum koneksi yang dapat dibuat dalam pool
  queueLimit: 0             // Jumlah permintaan maksimum yang dapat di-queue jika semua koneksi sedang digunakan (0 berarti tidak terbatas)
});

// Menguji koneksi database saat aplikasi dimulai.
// Ini penting untuk memastikan bahwa server dapat terhubung ke database.
pool.getConnection()
  .then(connection => {
    console.log('Terhubung ke database MySQL via Pool!'); // Pesan sukses jika koneksi berhasil
    connection.release(); // Melepaskan koneksi kembali ke pool
  })
  .catch(err => {
    // Menangani error jika koneksi database gagal
    console.error('Error saat terhubung ke database MySQL: ' + err.stack);
    process.exit(1); // Menghentikan aplikasi jika gagal terhubung ke database
  });

module.exports = pool; // Mengekspor pool koneksi agar dapat digunakan di file lain
