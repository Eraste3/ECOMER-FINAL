const router = require('express').Router();
const prisma = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');
const paginate = require('../utils/paginate');

const userSelect = {
  id: true, nom: true, email: true, telephone: true, role: true, actif: true,
  createdAt: true, updatedAt: true,
  citoyen: { select: { ecoPoints: true, niveau: true } },
  recycleur: { select: { entreprise: true, typesMateriaux: true } },
  agent: { select: { id: true } }
};

function shape(u) {
  return {
    ...u,
    ecoPoints: u.citoyen?.ecoPoints ?? 0,
    niveau: u.citoyen?.niveau ?? null,
    organisation: u.recycleur?.entreprise ?? null,
    matieres: u.recycleur?.typesMateriaux ?? []
  };
}

router.get('/', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const { role, q } = req.query;
    const where = {};
    if (role) where.role = role;
    if (q) {
      where.OR = [
        { nom: { contains: String(q), mode: 'insensitive' } },
        { email: { contains: String(q), mode: 'insensitive' } }
      ];
    }
    const { enabled, skip, take } = paginate(req);
    const rows = await prisma.utilisateur.findMany({ where, select: userSelect, orderBy: { createdAt: 'desc' }, ...(enabled ? { skip, take } : {}) });
    res.json(rows.map(shape));
  } catch (e) { next(e); }
});

router.get('/:id', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const u = await prisma.utilisateur.findUnique({ where: { id: Number(req.params.id) }, select: userSelect });
    if (!u) return res.status(404).json({ detail: 'Utilisateur introuvable.' });
    res.json(shape(u));
  } catch (e) { next(e); }
});

router.patch('/:id', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(422).json({ detail: 'Identifiant invalide.' });
    const data = {};
    if (req.body.actif !== undefined) data.actif = Boolean(req.body.actif);
    if (req.body.nom !== undefined) data.nom = req.body.nom;
    if (req.body.telephone !== undefined) data.telephone = req.body.telephone;
    const u = await prisma.utilisateur.update({ where: { id }, data, select: userSelect });
    res.json(shape(u));
  } catch (e) { next(e); }
});

module.exports = router;