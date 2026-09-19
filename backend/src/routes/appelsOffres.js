const router = require('express').Router();
const prisma = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');
const paginate = require('../utils/paginate');
const validate = require('../middleware/validate');
const schemas = require('../utils/schemas');

router.post('/', auth, validate(schemas.appelOffres), async (req, res, next) => {
  try {
    const { zoneId, type, dateIntervention, placesRequises = 1, remuneration = 0, equipement, description } = req.body;
    if (!zoneId || !type || !dateIntervention) return res.status(422).json({ detail: 'zoneId, type et dateIntervention sont requis.' });
    const a = await prisma.appelOffres.create({
      data: {
        zoneId: Number(zoneId), type,
        dateIntervention: new Date(dateIntervention),
        placesRequises: Number(placesRequises), remuneration: Number(remuneration),
        equipement, description
      }
    });
    res.status(201).json(a);
  } catch (e) { next(e); }
});

router.get('/', async (req, res, next) => {
  try {
    const { enabled, skip, take } = paginate(req);
    res.json(await prisma.appelOffres.findMany({
      include: { zone: { include: { operations: { select: { id: true, statut: true } } } }, participations: { include: { utilisateur: { select: { id: true, nom: true, role: true } } } } },
      orderBy: { dateIntervention: 'asc' },
      ...(enabled ? { skip, take } : {})
    }));
  } catch (e) { next(e); }
});

router.post('/:id/participer', auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const a = await prisma.appelOffres.findUnique({ where: { id }, include: { participations: true } });
    if (!a) return res.status(404).json({ detail: 'Appel introuvable.' });
    if (a.statut !== 'ouvert') return res.status(409).json({ detail: 'Cet appel n\'accepte plus de participation.' });
    if (a.participations.length >= a.placesRequises) return res.status(409).json({ detail: 'Nombre de places atteint.' });
    const exist = await prisma.participation.findUnique({ where: { appelOffresId_utilisateurId: { appelOffresId: id, utilisateurId: req.user.id } } });
    if (exist) return res.status(409).json({ detail: 'Vous êtes déjà inscrit à cet appel.' });
    const p = await prisma.participation.create({
      data: { appelOffresId: id, utilisateurId: req.user.id, equipeId: (req.body || {}).equipeId ? Number(req.body.equipeId) : undefined }
    });
    res.status(201).json(p);
  } catch (e) { next(e); }
});

router.delete('/:id/participer', auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const result = await prisma.participation.deleteMany({
      where: { appelOffresId: id, utilisateurId: req.user.id }
    });
    if (result.count === 0) return res.status(404).json({ detail: 'Participation introuvable.' });
    res.status(204).end();
  } catch (e) { next(e); }
});

router.patch('/:id/statut', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { statut } = req.body;
    if (!['ouvert', 'complet', 'termine', 'annule'].includes(statut)) return res.status(422).json({ detail: 'Statut invalide.' });
    const a = await prisma.appelOffres.update({ where: { id }, data: { statut } });
    res.json(a);
  } catch (e) { next(e); }
});

module.exports = router;