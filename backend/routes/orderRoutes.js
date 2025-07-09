const express = require('express');
const router = express.Router(); // Membuat instance router Express
const orderController = require('../controllers/orderController'); // Mengimpor controller pesanan

// Mendefinisikan rute untuk operasi CRUD pada pesanan:

// GET /api/orders - Mendapatkan semua pesanan
router.get('/', orderController.getOrders);

// GET /api/orders/:id - Mendapatkan pesanan berdasarkan ID
router.get('/:id', orderController.getOrderById);

// POST /api/orders - Menambahkan pesanan baru
router.post('/', orderController.createOrder);

// PATCH /api/orders/:id - Memperbarui pesanan berdasarkan ID
router.patch('/:id', orderController.updateOrder);

// DELETE /api/orders/:id - Menghapus pesanan berdasarkan ID
router.delete('/:id', orderController.deleteOrder);

module.exports = router; // Mengekspor router agar dapat digunakan di app.js
