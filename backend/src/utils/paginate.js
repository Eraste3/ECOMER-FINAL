/**
 * Pagination optionnelle : active uniquement si `page` ou `limit` est présent
 * dans la query string. Sans paramètres, le comportement historique est
 * conservé (retour de toutes les lignes — rétrocompatibilité frontend).
 * Usage : `const { enabled, skip, take } = paginate(req);`
 */
function paginate(req) {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const enabled = (Number.isFinite(page) && page > 0) || (Number.isFinite(limit) && limit > 0);
  if (!enabled) return { enabled: false, skip: 0, take: undefined, page: null, limit: null };
  const p = Math.max(1, Math.floor(page) || 1);
  const l = Math.min(500, Math.max(1, Math.floor(limit) || 50));
  return { enabled: true, skip: (p - 1) * l, take: l, page: p, limit: l };
}

module.exports = paginate;