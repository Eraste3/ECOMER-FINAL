const router = require('express').Router();
const prisma = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    res.json(await prisma.zonePollution.findMany({
      include: {
        signalements: true,
        operations: { select: { id: true, statut: true, dateFin: true } },
        appelsOffres: { select: { id: true, statut: true, type: true } }
      },
      orderBy: { updatedAt: 'desc' }
    }));
  } catch (e) { next(e); }
});

router.post('/', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const { nom, latitude, longitude, rayonMetres = 150, criticite = 'faible', tonnageEstimeKg = 0, typeDechetDominant } = req.body;
    if (latitude === undefined || longitude === undefined) return res.status(422).json({ detail: 'latitude et longitude sont requis.' });
    const z = await prisma.zonePollution.create({
      data: {
        nom: nom || null, latitude: Number(latitude), longitude: Number(longitude),
        rayonMetres: Number(rayonMetres), criticite: criticite || 'faible',
        tonnageEstimeKg: Number(tonnageEstimeKg) || 0, typeDechetDominant,
        statut: 'validee'
      }
    });
    res.status(201).json(z);
  } catch (e) { next(e); }
});

router.get('/prioritaires', async (req, res, next) => {
  try {
    res.json(await prisma.zonePollution.findMany({
      where: { criticite: { in: ['elevee', 'critique'] }, statut: 'validee' },
      include: { operations: { select: { id: true, statut: true, dateFin: true } } },
      orderBy: { tonnageEstimeKg: 'desc' }
    }));
  } catch (e) { next(e); }
});

router.patch('/:id/valider', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const STATUTS = ['en_attente', 'validee', 'rejetee', 'resolue'];
    const statut = req.body.statut || 'validee';
    if (!STATUTS.includes(statut)) return res.status(422).json({ detail: 'Statut invalide.' });
    res.json(await prisma.zonePollution.update({
      where: { id: Number(req.params.id) },
      data: { statut, criticite: req.body.criticite ?? undefined, tonnageEstimeKg: req.body.tonnageEstimeKg ?? undefined }
    }));
  } catch (e) { next(e); }
});

router.patch('/:id/resoudre', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const zone = await prisma.zonePollution.findUnique({ where: { id } });
    if (!zone) return res.status(404).json({ detail: 'Zone introuvable.' });
    const [z] = await prisma.$transaction([
      prisma.zonePollution.update({ where: { id }, data: { statut: 'resolue' } }),
      prisma.operation.updateMany({ where: { zoneId: id, statut: { in: ['planifiee', 'en_cours'] } }, data: { statut: 'terminee', dateFin: new Date() } })
    ]);
    res.json(z);
  } catch (e) { next(e); }
});

module.exports = router;