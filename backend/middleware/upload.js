const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const name = path.basename(file.originalname, ext).toLowerCase().replace(/[^a-z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) cb(null, true);
  else cb(new Error('მხოლოდ სურათების ატვირთვაა შესაძლებელი'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const single = (fieldName = 'image') => (req, res, next) => {
  upload.single(fieldName)(req, res, err => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

const multiple = (fieldName = 'images', maxCount = 3) => (req, res, next) => {
  upload.array(fieldName, maxCount)(req, res, err => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

module.exports = { single, multiple, upload };
