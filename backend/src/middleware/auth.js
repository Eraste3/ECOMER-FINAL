const prisma = require('../config/database');
const { verifyToken } = require('../utils/security');
const { isRevoked } = require('../utils/revocation');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ detail: 'Token Bearer requis.' });
    const payload = verifyToken(header.slice(7));
    if (await isRevoked(payload)) return res.status(401).json({ detail: 'Session révoquée. Reconnectez-vous.' });
    const user = await prisma.utilisateur.findUnique({ where: { id: Number(payload.sub) } });
    if (!user || !user.actif) return res.status(401).json({ detail: 'Utilisateur non authentifié.' });
    req.user = user;
    req.token = payload;
    next();
  } catch (e) { return res.status(401).json({ detail: 'Token invalide ou expiré.' }); }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ detail: 'Permissions insuffisantes.' });
    next();
  };
}
module.exports = { auth, requireRole };
