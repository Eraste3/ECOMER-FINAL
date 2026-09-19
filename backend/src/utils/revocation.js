const prisma = require('../config/database');

/** Vrai si le jti du token a été révoqué (déconnexion). */
async function isRevoked(payload) {
  try {
    if (!payload || !payload.jti) return false;
    return Boolean(await prisma.tokenInvalide.findUnique({ where: { jti: payload.jti } }));
  } catch { return false; }
}

/** Révoque un token (et purge les entrées expirées en passant). */
async function revoke(payload) {
  if (!payload || !payload.jti) return;
  const expiresAt = payload.exp ? new Date(payload.exp * 1000) : new Date(Date.now() + 7 * 24 * 3600 * 1000);
  await prisma.tokenInvalide.upsert({
    where: { jti: payload.jti },
    update: {},
    create: { jti: payload.jti, expiresAt }
  }).catch(() => { /* best-effort */ });
  prisma.tokenInvalide.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {});
}

module.exports = { isRevoked, revoke };