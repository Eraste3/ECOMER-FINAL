const router = require('express').Router();
const prisma = require('../config/database');
const { auth } = require('../middleware/auth');

router.get('/ecomer', auth, async (req, res, next) => {
  try {
    const [utilisateurs, signalements, zones, operations, stock, lots, commandes, recycleurs, signalementsValides, zonesResolues] =
      await Promise.all([
        prisma.utilisateur.count(),
        prisma.signalement.count(),
        prisma.zonePollution.count(),
        prisma.operation.count(),
        prisma.stockEcomer.findMany(),
        prisma.lotEcoshop.count(),
        prisma.commande.count(),
        prisma.recycleur.count(),
        prisma.signalement.count({ where: { statut: 'valide' } }),
        prisma.zonePollution.count({ where: { OR: [{ statut: 'resolue' }, { operations: { some: { statut: 'terminee' } } }] } })
      ]);
    res.json({ utilisateurs, signalements, signalementsValides, zones, zonesResolues, operations, recycleurs, lots, commandes, stock });
  } catch (e) { next(e); }
});

router.get('/citoyen', auth, async (req, res, next) => {
  try {
    const [signalements, signalementsValides, participations, notifications, citoyen, operationsEnCours] =
      await Promise.all([
        prisma.signalement.count({ where: { utilisateurId: req.user.id } }),
        prisma.signalement.count({ where: { utilisateurId: req.user.id, statut: 'valide' } }),
        prisma.participation.count({ where: { utilisateurId: req.user.id } }),
        prisma.notification.count({ where: { utilisateurId: req.user.id, lue: false } }),
        prisma.citoyen.findUnique({ where: { utilisateurId: req.user.id } }),
        prisma.operation.count({ where: { statut: 'en_cours' } })
      ]);
    res.json({
      signalements, signalementsValides, participations, notificationsNonLues: notifications,
      operationsEnCours, totalPoints: citoyen?.ecoPoints ?? 0, niveau: citoyen?.niveau ?? null
    });
  } catch (e) { next(e); }
});

module.exports = router;