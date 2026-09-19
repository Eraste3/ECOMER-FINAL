function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 'P2002') return res.status(409).json({ detail: 'Une donnée unique existe déjà.', meta: err.meta });
  if (err.code === 'P2025') return res.status(404).json({ detail: 'Ressource introuvable.' });
  res.status(err.status || 500).json({ detail: err.message || 'Erreur interne du serveur.' });
}
module.exports = errorHandler;
