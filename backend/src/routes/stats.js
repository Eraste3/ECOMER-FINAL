const router = require('express').Router();
const prisma = require('../config/database');

function round(v, d) { const f = Math.pow(10, d); return Math.round(v * f) / f; }

router.get('/resume', async (req, res, next) => {
  try {
    const [totalSignalements, signalementsValides, operationsEnCours, totalPoints, appelsOuverts] = await Promise.all([
      prisma.signalement.count(),
      prisma.signalement.count({ where: { statut: 'valide' } }),
      prisma.operation.count({ where: { statut: 'en_cours' } }),
      prisma.citoyen.aggregate({ _sum: { ecoPoints: true } }),
      prisma.appelOffres.count({ where: { statut: { in: ['ouvert', 'complet'] } } })
    ]);
    res.json({
      totalSignalements,
      signalementsValides,
      operationsEnCours: operationsEnCours + appelsOuverts,
      totalPoints: totalPoints._sum.ecoPoints ?? 0
    });
  } catch (e) { next(e); }
});

router.get('/par-type', async (req, res, next) => {
  try {
    const rows = await prisma.signalement.groupBy({ by: ['typeDechet'], _count: { _all: true } });
    const total = rows.reduce((sum, r) => sum + r._count._all, 0);
    res.json(rows.map((r) => ({ type_dechet: r.typeDechet || 'autre', count: r._count._all, total })));
  } catch (e) { next(e); }
});

router.get('/evolution', async (req, res, next) => {
  try {
    const rows = await prisma.signalement.findMany({ select: { createdAt: true }, orderBy: { createdAt: 'asc' } });
    const months = {};
    for (const s of rows) {
      const key = s.createdAt.toISOString().slice(0, 7);
      months[key] = (months[key] || 0) + 1;
    }
    res.json(Object.keys(months).map((mois) => ({ mois, count: months[mois] })));
  } catch (e) { next(e); }
});

router.get('/zones-critiques', async (req, res, next) => {
  try {
    const limite = Number(req.query.limite || 20);
    const zones = await prisma.zonePollution.findMany({
      where: { criticite: { in: ['elevee', 'critique'] }, statut: 'validee' },
      include: { _count: { select: { signalements: true } } },
      orderBy: { tonnageEstimeKg: 'desc' },
      take: limite
    });
    if (zones.length > 0) {
      return res.json(zones.map((z) => ({
        latitude: z.latitude,
        longitude: z.longitude,
        nb_signalements: z._count.signalements,
        count: z._count.signalements
      })));
    }
    const signalements = await prisma.signalement.findMany({ where: { statut: 'valide' }, select: { latitude: true, longitude: true } });
    const clusters = {};
    for (const s of signalements) {
      const key = `${round(s.latitude, 2)},${round(s.longitude, 2)}`;
      if (!clusters[key]) clusters[key] = { latitude: round(s.latitude, 2), longitude: round(s.longitude, 2), count: 0 };
      clusters[key].count++;
    }
    const list = Object.values(clusters)
      .sort((a, b) => b.count - a.count)
      .slice(0, limite)
      .map((c) => ({ ...c, nb_signalements: c.count }));
    res.json(list);
  } catch (e) { next(e); }
});

router.get('/classement', async (req, res, next) => {
  try {
    const limite = Number(req.query.limite || 50);
    const citoyens = await prisma.citoyen.findMany({
      include: { utilisateur: { select: { nom: true } } },
      orderBy: { ecoPoints: 'desc' },
      take: limite
    });
    res.json(citoyens.map((c, i) => ({ rang: i + 1, id: c.id, nom: c.utilisateur.nom, points: c.ecoPoints })));
  } catch (e) { next(e); }
});

module.exports = router;