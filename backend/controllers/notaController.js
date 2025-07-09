const db = require('../config/db'); // Mengimpor pool koneksi database
// const nodemailer = require('nodemailer'); // Uncomment jika Anda menginstal dan mengkonfigurasi Nodemailer

// Fungsi helper untuk memformat harga ke Rupiah
const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Fungsi untuk membuat konten HTML untuk nota (tetap sama)
const generateNotaHtml = (order, servicePrices) => {
    // Mencari harga layanan yang sesuai
    let servicePrice = 0;
    const serviceCategory = servicePrices.find(cat => cat.name === order.serviceType);

    if (serviceCategory && serviceCategory.prices) {
        // Jika layanan memiliki harga berdasarkan ukuran
        if (serviceCategory.prices.length > 1) {
            const priceItem = serviceCategory.prices.find(p => p.size_type === order.shoeType);
            servicePrice = priceItem ? priceItem.price : 0;
        } else if (serviceCategory.prices.length === 1) {
            // Jika layanan hanya memiliki satu harga (misal: Cuci luar)
            servicePrice = serviceCategory.prices[0].price;
        }
    }

    const totalAmount = servicePrice; // Untuk nota sederhana, total sama dengan harga layanan

    return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nota Pemesanan Essentials Shoes Clean</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 20px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.1); border-top: 5px solid #007bff; }
            h1 { text-align: center; color: #007bff; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            p { margin-bottom: 8px; }
            .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .details-table th, .details-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .details-table th { background-color: #f2f2f2; color: #333; }
            .total { text-align: right; font-size: 1.2em; font-weight: bold; margin-top: 20px; padding-top: 10px; border-top: 2px dashed #ddd; }
            .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #777; }
            .logo { text-align: center; margin-bottom: 20px; }
            .logo img { max-width: 150px; height: auto; }
            .info-box { background-color: #e9f7ff; border-left: 5px solid #007bff; padding: 15px; margin-top: 20px; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <!-- Anda bisa menambahkan logo di sini jika ada -->
                <img src="https://placehold.co/150x50/007bff/ffffff?text=ESSENTIALS" alt="Essentials Shoes Clean Logo">
            </div>
            <h1>Nota Pemesanan</h1>

            <div class="info-box">
                <p><strong>Essentials Shoes Clean</strong></p>
                <p>Jl. Contoh No. 123, Kota Anda</p>
                <p>Telp: 082189155101</p>
                <p>Instagram: @essentials.shoes.clean</p>
            </div>

            <h2>Detail Pelanggan</h2>
            <p><strong>Nama:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail || '-'}</p>
            <p><strong>Telepon:</strong> ${order.customerPhone || '-'}</p> {/* <--- BARU: Tampilkan nomor telepon */}
            <p><strong>Tanggal Pemesanan:</strong> ${order.orderDate}</p>
            ${order.pickupDate ? `<p><strong>Tanggal Pengambilan:</strong> ${order.pickupDate}</p>` : ''}

            <h2>Detail Layanan</h2>
            <table class="details-table">
                <thead>
                    <tr>
                        <th>Layanan</th>
                        <th>Jenis Sepatu</th>
                        <th>Catatan</th>
                        <th>Harga</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${order.serviceType}</td>
                        <td>${order.shoeType}</td>
                        <td>${order.notes || '-'}</td>
                        <td>${formatRupiah(servicePrice)}</td>
                    </tr>
                </tbody>
            </table>

            <div class="total">
                Total Pembayaran: ${formatRupiah(totalAmount)}
            </div>

            <div class="footer">
                <p>Terima kasih telah menggunakan layanan Essentials Shoes Clean!</p>
                <p>Sepatu Anda akan kembali bersinar.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// --- Fungsi Konseptual untuk Mengirim Pesan WhatsApp ---
const sendWhatsAppMessage = async (toPhoneNumber, messageText) => {
    // Nomor telepon harus dalam format internasional tanpa tanda '+' atau spasi
    // Contoh: '6281234567890' untuk Indonesia
    const formattedPhoneNumber = toPhoneNumber.replace(/\D/g, ''); // Hapus semua non-digit

    // Di sini Anda akan mengintegrasikan dengan WhatsApp Business API atau layanan pihak ketiga.
    // Ini adalah contoh menggunakan 'fetch' ke API pihak ketiga (misalnya, jika Anda menggunakan layanan seperti Twilio, MessageBird, atau API WhatsApp Business langsung).
    // Anda perlu mengganti URL, headers, dan body sesuai dengan dokumentasi API yang Anda gunakan.

    console.log(`Mencoba mengirim pesan WhatsApp ke: ${formattedPhoneNumber}`);
    console.log(`Isi pesan: ${messageText}`);

    try {
        // Contoh placeholder untuk panggilan API WhatsApp
        // const response = await fetch('https://api.whatsapp.com/v1/messages', { // Ganti dengan URL API WhatsApp Anda
        //     method: 'POST',
        //     headers: {
        //         'Authorization': 'Bearer YOUR_WHATSAPP_BUSINESS_API_TOKEN', // Ganti dengan token API Anda
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         messaging_product: 'whatsapp',
        //         to: formattedPhoneNumber,
        //         type: 'text',
        //         text: {
        //             body: messageText
        //         }
        //     })
        // });

        // const data = await response.json();
        // if (response.ok) {
        //     console.log('Pesan WhatsApp berhasil dikirim:', data);
        //     return { success: true, data: data };
        // } else {
        //     console.error('Gagal mengirim pesan WhatsApp:', data);
        //     return { success: false, error: data };
        // }

        // Untuk tujuan demo, kita hanya akan mensimulasikan pengiriman
        return { success: true, message: 'Simulasi pengiriman WhatsApp berhasil!' };

    } catch (error) {
        console.error('Error saat melakukan panggilan API WhatsApp:', error);
        return { success: false, error: error.message };
    }
};


// @desc    Mengirim nota pemesanan ke pelanggan
// @route   POST /api/nota/send
// @access  Public (untuk demo, di produksi butuh autentikasi)
exports.sendNota = async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: 'ID Pesanan wajib disertakan.' });
    }

    try {
        // 1. Ambil detail pesanan dari database
        const [orderRows] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (orderRows.length === 0) {
            return res.status(404).json({ message: `Pesanan dengan ID ${orderId} tidak ditemukan.` });
        }
        const order = orderRows[0];

        // Memastikan email pelanggan ada di data pesanan yang diambil dari DB
        if (!order.customerEmail) {
            console.warn(`Email pelanggan untuk pesanan ID ${orderId} tidak ditemukan. Pengiriman email mungkin tidak berfungsi.`);
            // return res.status(400).json({ message: `Email pelanggan untuk pesanan ID ${orderId} tidak ditemukan di database.` }); // Opsional: jika email wajib
        }
        // Memastikan nomor telepon pelanggan ada di data pesanan yang diambil dari DB
        if (!order.customerPhone) {
            console.warn(`Nomor telepon pelanggan untuk pesanan ID ${orderId} tidak ditemukan. Pengiriman WhatsApp mungkin tidak berfungsi.`);
            // return res.status(400).json({ message: `Nomor telepon pelanggan untuk pesanan ID ${orderId} tidak ditemukan di database.` }); // Opsional: jika telepon wajib
        }


        // 2. Ambil daftar layanan dan harga dari database (untuk menghitung harga nota)
        const [services] = await db.execute('SELECT * FROM services ORDER BY id');
        const [prices] = await db.execute('SELECT * FROM service_prices ORDER BY service_id');

        const servicePrices = services.map(service => {
            const relatedPrices = prices.filter(price => price.service_id === service.id);
            return {
                ...service,
                prices: relatedPrices.map(p => ({
                    size_type: p.size_type,
                    price: parseFloat(p.price)
                }))
            };
        });

        // 3. Buat konten HTML nota (untuk email atau tampilan)
        const notaHtml = generateNotaHtml(order, servicePrices);

        // 4. Buat pesan teks sederhana untuk WhatsApp
        let whatsappMessage = `Halo ${order.customerName},\n\n`;
        whatsappMessage += `Berikut adalah detail pesanan Anda di Essentials Shoes Clean:\n`;
        whatsappMessage += `ID Pesanan: #${order.id}\n`;
        whatsappMessage += `Layanan: ${order.serviceType}\n`;
        whatsappMessage += `Jenis Sepatu: ${order.shoeType}\n`;
        whatsappMessage += `Status: ${order.status}\n`;
        whatsappMessage += `Total: ${formatRupiah(servicePrices.find(cat => cat.name === order.serviceType)?.prices.find(p => p.size_type === order.shoeType)?.price || servicePrices.find(cat => cat.name === order.serviceType)?.prices[0]?.price || 0)}\n\n`;
        whatsappMessage += `Terima kasih telah mempercayakan sepatu Anda kepada kami!\n`;
        whatsappMessage += `Essentials Shoes Clean`;

        // 5. Logika pengiriman (email dan WhatsApp)
        const sendResults = {
            email: { success: false, message: 'Email tidak dikirim (fitur dikomentari).' },
            whatsapp: { success: false, message: 'WhatsApp tidak dikirim (fitur dikomentari).' }
        };

        // Contoh Pengiriman Email (Uncomment dan konfigurasi jika ingin aktif)
        /*
        try {
            let transporter = nodemailer.createTransport({ ... }); // Konfigurasi Nodemailer Anda
            let mailOptions = {
                from: 'Essentials Shoes Clean <noreply@essentialsshoesclean.com>',
                to: order.customerEmail,
                subject: `Nota Pemesanan #${order.id} - Essentials Shoes Clean`,
                html: notaHtml
            };
            await transporter.sendMail(mailOptions);
            sendResults.email = { success: true, message: 'Email berhasil dikirim.' };
            console.log(`Nota email untuk pesanan ${order.id} berhasil dikirim ke ${order.customerEmail}`);
        } catch (emailErr) {
            sendResults.email = { success: false, message: `Gagal mengirim email: ${emailErr.message}` };
            console.error('Error mengirim email:', emailErr);
        }
        */

        // Contoh Pengiriman WhatsApp (Uncomment dan konfigurasi jika ingin aktif)
        if (order.customerPhone) {
            const whatsappRes = await sendWhatsAppMessage(order.customerPhone, whatsappMessage);
            sendResults.whatsapp = whatsappRes;
            if (whatsappRes.success) {
                console.log(`Nota WhatsApp untuk pesanan ${order.id} berhasil dikirim ke ${order.customerPhone}`);
            } else {
                console.error(`Gagal mengirim WhatsApp untuk pesanan ${order.id}:`, whatsappRes.error);
            }
        } else {
            sendResults.whatsapp.message = 'Nomor telepon pelanggan tidak tersedia untuk pengiriman WhatsApp.';
        }


        res.status(200).json({
            message: `Nota untuk pesanan ${order.id} berhasil diproses.`,
            notaContent: notaHtml, // Mengembalikan konten HTML untuk tampilan/debug
            sendResults: sendResults // Mengembalikan status pengiriman
        });

    } catch (error) {
        console.error('Error saat memproses nota:', error);
        res.status(500).json({ message: 'Server Error: Gagal membuat atau mengirim nota.' });
    }
};
