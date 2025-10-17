// backend/middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

console.log('🔧 Configuring Cloudinary...');

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('✅ Cloudinary configured:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '✓' : '✗',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✓' : '✗'
});

// ✅ Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    transformation: [
      { 
        width: 1200, 
        height: 1200, 
        crop: 'limit', 
        quality: 'auto:good',
        fetch_format: 'auto'
      }
    ],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      return `product-${timestamp}-${randomStr}`;
    }
  }
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype) {
      cb(null, true);
    } else {
      cb(new Error('მხოლოდ სურათების ატვირთვაა შესაძლებელი (jpg, png, gif, webp)'));
    }
  }
});

const single = (fieldName = 'image') => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      console.error('❌ Single upload error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'სურათის ატვირთვა ვერ მოხერხდა'
      });
    }
    console.log('✅ Single file uploaded:', req.file?.path);
    next();
  });
};

const multiple = (fieldName = 'images', maxCount = 3) => (req, res, next) => {
  upload.array(fieldName, maxCount)(req, res, (err) => {
    if (err) {
      console.error('❌ Multiple upload error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'სურათების ატვირთვა ვერ მოხერხდა'
      });
    }
    console.log(`✅ ${req.files?.length || 0} files uploaded to Cloudinary`);
    next();
  });
};

module.exports = { single, multiple, upload, cloudinary };
