const router = require('express').Router();
const prisma = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');
const paginate = require('../utils/paginate');
const validate = require('../middleware/validate');
const schemas = require('../utils/schemas');

router.get('/lots', async (req, res, next) => {
  try {
    const { enabled, skip, take } = paginate(req);
    res.json(await prisma.lotEcoshop.findMany({ orderBy: { createdAt: 'desc' }, ...(enabled ? { skip, take } : {}) }));
  } catch (e) { next(e); }
});

router.post('/lots', auth, requireRole('admin', 'agent'), validate(schemas.lotEcoshop), async (req, res, next) => {
  try {
    const { categorie, quantiteKg, qualite = 'prepare', prixUnitaire } = req.body;
    const q = Number(quantiteKg), p = Number(prixUnitaire);
    if (!categorie || q <= 0 || p <= 0) return res.status(422).json({ detail: 'Données du lot invalides.' });
    const result = await prisma.$transaction(async (tx) => {
      const stock = await tx.stockEcomer.findUnique({ where: { categorie } });
      if (!stock || stock.quantiteKg < q) throw Object.assign(new Error('Stock insuffisant.'), { status: 409 });
      const lot = await tx.lotEcoshop.create({ data: { categorie, quantiteKg: q, qualite, prixUnitaire: p } });
      await tx.stockEcomer.update({ where: { categorie }, data: { quantiteKg: { decrement: q } } });
      await tx.mouvementStock.create({ data: { stockId: stock.id, type: 'sortie', quantiteKg: q, motif: 'Création lot ECOSHOP', referenceId: lot.id } });
      return lot;
    });
    res.status(201).json(result);
  } catch (e) { next(e); }
});

router.patch('/lots/:id', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { statut } = req.body;
    if (!['disponible', 'reserve', 'vendu', 'annule'].includes(statut)) return res.status(422).json({ detail: 'Statut invalide.' });
    const lot = await prisma.lotEcoshop.update({ where: { id }, data: { statut } });
    res.json(lot);
  } catch (e) { next(e); }
});

router.post('/commandes', auth, requireRole('recycleur'), validate(schemas.commandeEcoshop), async (req, res, next) => {
  try {
    const { lotId, quantiteKg, typeTransaction = 'achat', montantOffre } = req.body;
    const lot = await prisma.lotEcoshop.findUnique({ where: { id: Number(lotId) } });
    if (!lot) return res.status(404).json({ detail: 'Lot introuvable.' });
    if (Number(quantiteKg) <= 0 || Number(quantiteKg) > lot.quantiteKg) return res.status(422).json({ detail: 'Quantité invalide.' });
    if (lot.statut !== 'disponible') return res.status(409).json({ detail: 'Lot indisponible.' });

    const result = await prisma.$transaction(async (tx) => {
      const c = await tx.commande.create({
        data: { lotId: Number(lotId), utilisateurId: req.user.id, quantiteKg: Number(quantiteKg), typeTransaction, montantOffre: montantOffre === undefined ? undefined : Number(montantOffre) }
      });
      await tx.lotEcoshop.update({ where: { id: lot.id }, data: { statut: 'reserve' } });
      await tx.notification.createMany({
        data: [
          { utilisateurId: req.user.id, titre: 'Commande envoyée', message: `Commande ${c.id} créée sur le lot ${lot.id}.` }
        ]
      });
      return c;
    });
    res.status(201).json(result);
  } catch (e) { next(e); }
});

router.get('/commandes', auth, async (req, res, next) => {
  try {
    const { enabled, skip, take } = paginate(req);
    const include = { lot: true, utilisateur: { select: { id: true, nom: true, email: true } } };
    if (req.user.role === 'recycleur') {
      res.json(await prisma.commande.findMany({ where: { utilisateurId: req.user.id }, include, orderBy: { createdAt: 'desc' }, ...(enabled ? { skip, take } : {}) }));
    } else {
      res.json(await prisma.commande.findMany({ include, orderBy: { createdAt: 'desc' }, ...(enabled ? { skip, take } : {}) }));
    }
  } catch (e) { next(e); }
});

router.patch('/commandes/:id', auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { statut } = req.body;
    if (!['en_attente', 'confirmee', 'livree', 'payee', 'annulee'].includes(statut)) return res.status(422).json({ detail: 'Statut invalide.' });
    const existe = await prisma.commande.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ detail: 'Commande introuvable.' });
    if (req.user.role !== 'recycleur' && !['admin', 'agent'].includes(req.user.role)) return res.status(403).json({ detail: 'Permissions insuffisantes.' });
    if (req.user.role === 'recycleur' && existe.utilisateurId !== req.user.id) return res.status(403).json({ detail: 'Permissions insuffisantes.' });

    const result = await prisma.$transaction(async (tx) => {
      const c = await tx.commande.update({ where: { id }, data: { statut }, include: { lot: true } });
      if (statut === 'confirmee') {
        await tx.lotEcoshop.update({ where: { id: c.lotId }, data: { statut: 'vendu' } });
      } else if (['annulee', 'en_attente'].includes(statut) && c.lot.statut === 'reserve') {
        await tx.lotEcoshop.update({ where: { id: c.lotId }, data: { statut: 'disponible' } });
      }
      return c;
    });
    res.json(result);
  } catch (e) { next(e); }
});

module.exports = router;