const prisma = require('../config/database');

async function ensureTable() {
  try {
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS request_log (
      id BIGSERIAL PRIMARY KEY,
      at TIMESTAMPTZ NOT NULL DEFAULT now(),
      method TEXT, path TEXT, status INT, origin TEXT, ip TEXT, ua TEXT, has_auth BOOLEAN, body TEXT
    )`);
  } catch (e) { /* temporaire : on ne bloque jamais le flux sur la journalisation */ }
}

/** Tampon temporaire de diagnostic : journalise toute requête /signalements. */
function requestLog(req, res, next) {
  let loggedBody = null;
  const _json = res.json.bind(res);
  res.json = (obj) => {
    if (res.statusCode >= 400) {
      try { loggedBody = JSON.stringify(obj).slice(0, 500); } catch { /* ignore */ }
    }
    return _json(obj);
  };
  res.on('finish', () => {
    const hasAuth = !!(req.headers.authorization || '').startsWith('Bearer ');
    save({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      origin: req.headers.origin || null,
      ip: (req.headers['cf-connecting-ip'] || req.ip || '').slice(0, 45),
      ua: (req.headers['user-agent'] || '').slice(0, 120),
      hasAuth,
      body: loggedBody
    });
  });
  next();
}

function save(row) {
  prisma.$executeRawUnsafe(
    `INSERT INTO request_log (method, path, status, origin, ip, ua, has_auth, body) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    row.method, row.path, row.status, row.origin, row.ip, row.ua, row.hasAuth, row.body
  ).catch(() => { /* journalisation best-effort */ });
}

setImmediate(ensureTable);

module.exports = requestLog;