const express = require('express');
const router = express.Router(); // Membuat instance router Express
const notaController = require('../controllers/notaController'); // Mengimpor controller nota

// Mendefinisikan rute untuk mengirim nota:

// POST /api/nota/send - Mengirim nota pemesanan
router.post('/send', notaController.sendNota);

module.exports = router; // Mengekspor router agar dapat digunakan di app.js
