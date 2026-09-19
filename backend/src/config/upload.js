const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('./env');

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 8 * 1024 * 1024;

function fileFilter(req, file, cb) {
  if (allowedTypes.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Format d\'image non supporté.'));
}

// --- Cloudinary (production) : la photo est stockée dans le cloud et l'IA
// analyse l'URL publique renvoyée. Activé si les 3 variables sont fournies.
let cloudinary = null;
if (env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret) {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true
  });
}

function uploadToCloudinary(buffer, mimetype) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: env.cloudinaryFolder, resource_type: 'image', allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'] },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

// --- Repli local (développement sans identifiants Cloudinary) ---
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    cb(null, `sig-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const memoryUpload = multer({ storage: multer.memoryStorage(), fileFilter, limits: { fileSize: MAX_FILE_SIZE } });
const diskUpload = multer({ storage: diskStorage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });

/**
 * Middleware d'upload : Cloudinary si configuré, sinon disque local.
 * Renseigne `req.photoUrl` (URL publique) et, si Cloudinary, `req.photoPublicId`.
 */
function uploadPhoto(req, res, next) {
  if (!cloudinary) {
    return diskUpload.single('photo')(req, res, (err) => {
      if (err) return res.status(422).json({ detail: err.message });
      if (req.file) req.photoUrl = `/uploads/${req.file.filename}`;
      next();
    });
  }
  memoryUpload.single('photo')(req, res, async (err) => {
    if (err) return res.status(422).json({ detail: err.message });
    if (!req.file) return next();
    try {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      req.photoUrl = result.secure_url;
      req.photoPublicId = result.public_id;
      next();
    } catch (e) {
      res.status(502).json({ detail: `Échec de l'envoi de la photo vers Cloudinary : ${e.message}` });
    }
  });
}

module.exports = { uploadPhoto, isCloudinaryEnabled: () => Boolean(cloudinary) };
