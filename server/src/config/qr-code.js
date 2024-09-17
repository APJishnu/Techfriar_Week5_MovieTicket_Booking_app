const QRCode = require('qrcode'); // Import the QR code library

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'de20of6mt',
  api_key: '675983841487782',
  api_secret: 'h1YeKwSadXh-gGn2gDvjYQ8-vfU',
});

// Generate QR Code and upload to Cloudinary
const generateQRCode = async (qrData) => {
  try {
    // Generate QR code as a Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    // Upload the QR code to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(qrCodeDataUrl, {
      folder: 'qr-codes',
      public_id: `booking-${Date.now()}`, // Use a unique ID or timestamp
      resource_type: 'image',
    });

    return uploadResponse.secure_url; // Return the public URL of the uploaded QR code
  } catch (error) {
    throw new Error(`Failed to generate or upload QR code: ${error.message}`);
  }
};

module.exports = {
  generateQRCode
};