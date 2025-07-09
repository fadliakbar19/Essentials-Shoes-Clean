const db = require('../config/db'); // Mengimpor pool koneksi database

// @desc    Mendapatkan semua pesanan
// @route   GET /api/orders
// @access  Public
exports.getOrders = async (req, res) => {
  try {
    // Mengeksekusi query SQL untuk mengambil semua data dari tabel 'orders'.
    // Hasilnya diurutkan berdasarkan tanggal pesanan (terbaru duluan) dan ID.
    const [rows] = await db.execute('SELECT * FROM orders ORDER BY orderDate DESC, id DESC');
    res.json(rows); // Mengirim data pesanan sebagai respons JSON
  } catch (error) {
    console.error('Error saat mengambil pesanan:', error); // Mencatat error ke konsol server
    res.status(500).json({ message: 'Server Error: Gagal mengambil pesanan' }); // Mengirim respons error ke klien
  }
};

// @desc    Mendapatkan satu pesanan berdasarkan ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    // Mengeksekusi query SQL untuk mengambil pesanan berdasarkan ID yang diberikan di parameter URL.
    const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      // Jika tidak ada pesanan ditemukan dengan ID tersebut
      return res.status(404).json({ message: `Pesanan dengan ID ${req.params.id} tidak ditemukan` });
    }
    res.json(rows[0]); // Mengirim pesanan yang ditemukan sebagai respons JSON
  } catch (error) {
    console.error('Error saat mengambil pesanan berdasarkan ID:', error);
    res.status(500).json({ message: 'Server Error: Gagal mengambil pesanan' });
  }
};

// @desc    Menambahkan pesanan baru
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  // Mendapatkan data dari body permintaan, termasuk customerEmail dan customerPhone
  const { customerName, customerEmail, customerPhone, shoeType, serviceType, notes, pickupDate } = req.body;

  // Validasi dasar: Memastikan field yang wajib tidak kosong
  if (!customerName || !customerEmail || !customerPhone || !shoeType || !serviceType) {
    return res.status(400).json({ message: 'Mohon lengkapi nama pelanggan, email, nomor telepon, jenis sepatu, dan jenis layanan.' });
  }

  const status = 'New'; // Status default untuk pesanan baru
  const orderDate = new Date().toISOString().slice(0, 10); // Mendapatkan tanggal saat ini dalam format YYYY-MM-DD

  try {
    // Mengeksekusi query SQL untuk menyisipkan data pesanan baru ke tabel 'orders'.
    // Pastikan kolom 'customerEmail', 'customerPhone', dan 'pickupDate' disertakan dalam query INSERT.
    const [result] = await db.execute(
      'INSERT INTO orders (customerName, customerEmail, customerPhone, shoeType, serviceType, status, orderDate, notes, pickupDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [customerName, customerEmail, customerPhone, shoeType, serviceType, status, orderDate, notes, pickupDate]
    );
    // Mengirim respons sukses dengan ID pesanan yang baru dibuat dan data yang dikirim
    res.status(201).json({ id: result.insertId, customerName, customerEmail, customerPhone, shoeType, serviceType, status, orderDate, notes, pickupDate });
  } catch (error) {
    console.error('Error saat membuat pesanan baru:', error);
    res.status(500).json({ message: 'Server Error: Tidak dapat membuat pesanan' });
  }
};

// @desc    Memperbarui pesanan berdasarkan ID
// @route   PATCH /api/orders/:id
// @access  Public
exports.updateOrder = async (req, res) => {
  const { id } = req.params; // Mendapatkan ID pesanan dari parameter URL
  const fields = req.body;   // Mendapatkan field yang akan diperbarui dari body permintaan
  const updateFields = [];
  const updateValues = [];

  // Membangun bagian SET dari query SQL secara dinamis berdasarkan field yang ada di body
  for (const key in fields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      updateFields.push(`${key} = ?`);
      updateValues.push(fields[key]);
    }
  }
  updateValues.push(id); // Menambahkan ID ke akhir array nilai untuk klausa WHERE

  if (updateFields.length === 0) {
    // Jika tidak ada field yang disediakan untuk diperbarui
    return res.status(400).json({ message: 'Tidak ada field yang disediakan untuk pembaruan.' });
  }

  try {
    // Mengeksekusi query SQL untuk memperbarui pesanan
    const [result] = await db.execute(
      `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      // Jika tidak ada baris yang terpengaruh, berarti pesanan tidak ditemukan
      return res.status(404).json({ message: `Pesanan dengan ID ${id} tidak ditemukan` });
    }
    // Mengambil data pesanan yang baru diperbarui untuk dikirim sebagai respons
    const [updatedOrder] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    res.json(updatedOrder[0]); // Mengirim pesanan yang diperbarui sebagai respons JSON
  } catch (error) {
    console.error('Error saat memperbarui pesanan:', error);
    res.status(500).json({ message: 'Server Error: Tidak dapat memperbarui pesanan' });
  }
};

// @desc    Menghapus pesanan berdasarkan ID
// @route   DELETE /api/orders/:id
// @access  Public
exports.deleteOrder = async (req, res) => {
  try {
    // Mengeksekusi query SQL untuk menghapus pesanan berdasarkan ID
    const [result] = await db.execute('DELETE FROM orders WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      // Jika tidak ada baris yang terpengaruh, berarti pesanan tidak ditemukan
      return res.status(404).json({ message: `Pesanan dengan ID ${req.params.id} tidak ditemukan` });
    }
    res.status(204).send(); // Mengirim respons 204 No Content (berhasil dihapus tanpa konten kembali)
  } catch (error) {
    console.error('Error saat menghapus pesanan:', error);
    res.status(500).json({ message: 'Server Error: Tidak dapat menghapus pesanan' });
  }
};
