// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');

// Memory storage - ფაილები RAM-ში ინახება დროებით
// ImgBB-ზე ატვირთვამდე
const storage = multer.memoryStorage();

// File filter - მხოლოდ სურათები
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('მხოლოდ სურათების ატვირთვაა შესაძლებელი (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Single file upload middleware
const single = (fieldName = 'image') => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'ფაილი ძალიან დიდია. მაქსიმალური ზომა: 5MB'
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      // Other errors
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

// Multiple files upload middleware
const multiple = (fieldName = 'images', maxCount = 3) => (req, res, next) => {
  upload.array(fieldName, maxCount)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'ფაილი ძალიან დიდია. მაქსიმალური ზომა: 5MB'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: `მაქსიმუმ ${maxCount} ფაილის ატვირთვაა შესაძლებელი`
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message
      });
    } else if (err) {
      // Other errors
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    next();
  });
};

module.exports = {
  single,
  multiple,
  upload
};