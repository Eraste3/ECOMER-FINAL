const crypto = require('crypto');
const router = require('express').Router();
const env = require('../config/env');
const { auth } = require('../middleware/auth');

// Signature Cloudinary pour téléversement DIRECT depuis le navigateur.
// Contourne le blocage réseau des POST multipart (Render/CF) vers l'API :
// la photo part vers api.cloudinary.com, l'API ne reçoit qu'un petit JSON.
router.get('/signature', auth, (req, res) => {
  const { cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret, cloudinaryFolder } = env;
  if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    return res.status(501).json({ detail: 'Cloudinary non configuré côté serveur.' });
  }
  const timestamp = Math.round(Date.now() / 1000);
  const publicId = `sig-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const toSign = `folder=${cloudinaryFolder}&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(toSign + cloudinaryApiSecret).digest('hex');
  res.json({ cloudName: cloudinaryCloudName, apiKey: cloudinaryApiKey, timestamp, signature, folder: cloudinaryFolder, publicId });
});

module.exports = router;