const QRCode = require('qrcode'); // Import the QR code library

const generateQRCode = async (qrData) => {
  try {
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    return qrCodeUrl;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

module.exports = {
  generateQRCode
};