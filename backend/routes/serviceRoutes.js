const express = require('express');
const router = express.Router(); // Membuat instance router Express
const serviceController = require('../controllers/serviceController'); // Mengimpor controller layanan

// Mendefinisikan rute untuk mendapatkan daftar layanan dan harga:

// GET /api/services - Mendapatkan semua layanan beserta harganya
router.get('/', serviceController.getServicesAndPrices);

module.exports = router; // Mengekspor router agar dapat digunakan di app.js
