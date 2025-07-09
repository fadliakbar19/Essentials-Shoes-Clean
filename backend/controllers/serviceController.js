const db = require('../config/db'); // Mengimpor pool koneksi database

// @desc    Mendapatkan semua layanan dan harga mereka
// @route   GET /api/services
// @access  Public
exports.getServicesAndPrices = async (req, res) => {
    try {
        // Mengambil semua data layanan dari tabel 'services'
        const [services] = await db.execute('SELECT * FROM services ORDER BY id');

        // Mengambil semua data harga layanan dari tabel 'service_prices'
        const [prices] = await db.execute('SELECT * FROM service_prices ORDER BY service_id');

        // Menggabungkan data layanan dengan harga-harga yang terkait.
        // Setiap layanan akan memiliki array 'prices' yang berisi semua harga untuk layanan tersebut.
        const servicesWithPrices = services.map(service => {
            const relatedPrices = prices.filter(price => price.service_id === service.id);
            return {
                ...service,
                prices: relatedPrices.map(p => ({
                    size_type: p.size_type, // Ukuran atau tipe (misal: 'Besar', 'Normal', 'Default')
                    price: parseFloat(p.price) // Memastikan harga adalah angka (float)
                }))
            };
        });

        res.json(servicesWithPrices); // Mengirim data layanan beserta harganya sebagai respons JSON
    } catch (error) {
        console.error('Error saat mengambil layanan dan harga:', error); // Mencatat error
        res.status(500).json({ message: 'Server Error: Gagal mengambil data layanan' }); // Mengirim respons error
    }
};
