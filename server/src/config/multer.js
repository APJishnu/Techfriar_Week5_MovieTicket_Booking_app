const multer = require('multer');
const path = require('path');

// Set the storage destination to the uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads'); // Move up one level to the 'server' folder
    console.log('Upload path:', uploadPath); // Debugging log
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
