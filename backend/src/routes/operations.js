const router = require('express').Router();
const prisma = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');
const paginate = require('../utils/paginate');
const validate = require('../middleware/validate');
const schemas = require('../utils/schemas');

const opInclude = {
  zone: true,
  equipe: { include: { agent: { include: { utilisateur: { select: { id: true, nom: true } } } } } },
  createur: { select: { id: true, nom: true, email: true, role: true } },
  dechets: true
};

router.post('/', auth, requireRole('admin', 'agent'), validate(schemas.operation), async (req, res, next) => {
  try {
    const { zoneId, equipeId, photoAvantUrl, titre, description, teamName, lead, agents, materials, interventionType, severity, priority, areaM2, dateDebut, deadline, collectedTons, statut } = req.body;
    if (!zoneId) return res.status(422).json({ detail: 'zoneId est requis.' });
    const STATUTS = ['planifiee', 'en_cours', 'terminee', 'annulee'];
    if (statut !== undefined && !STATUTS.includes(statut)) return res.status(422).json({ detail: 'statut invalide.' });
    const zone = await prisma.zonePollution.findUnique({ where: { id: Number(zoneId) } });
    if (!zone) return res.status(404).json({ detail: 'Zone introuvable.' });
    const o = await prisma.operation.create({
      data: {
        zoneId: Number(zoneId),
        equipeId: equipeId ? Number(equipeId) : undefined,
        createurId: req.user.id,
        photoAvantUrl, titre, description,
        statut: statut ?? undefined,
        teamName: teamName ?? undefined,
        lead: lead ?? undefined,
        agents: agents !== undefined ? Number(agents) : undefined,
        materials: Array.isArray(materials) ? materials : [],
        interventionType: interventionType ?? undefined,
        severity: severity ?? undefined,
        priority: priority ?? undefined,
        areaM2: areaM2 !== undefined ? Number(areaM2) : undefined,
        dateDebut: dateDebut ? new Date(dateDebut) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        collectedTons: collectedTons !== undefined ? Number(collectedTons) : undefined
      },
      include: opInclude
    });
    await prisma.notification.createMany({
      data: [
        { utilisateurId: req.user.id, titre: 'Opération planifiée', message: `Opération #${o.id} créée sur la zone ${zone.nom || zone.id}.` }
      ]
    });
    res.status(201).json(o);
  } catch (e) { next(e); }
});

router.get('/', auth, async (req, res, next) => {
  try {
    const { enabled, skip, take } = paginate(req);
    res.json(await prisma.operation.findMany({ include: opInclude, orderBy: { createdAt: 'desc' }, ...(enabled ? { skip, take } : {}) }));
  } catch (e) { next(e); }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const o = await prisma.operation.findUnique({ where: { id: Number(req.params.id) }, include: opInclude });
    if (!o) return res.status(404).json({ detail: 'Opération introuvable.' });
    res.json(o);
  } catch (e) { next(e); }
});

router.patch('/:id/statut', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { statut, dateDebut, dateFin } = req.body;
    if (!['planifiee', 'en_cours', 'terminee', 'annulee'].includes(statut)) return res.status(422).json({ detail: 'Statut invalide.' });
    const data = { statut };
    if (dateDebut) data.dateDebut = new Date(dateDebut);
    if (dateFin) data.dateFin = new Date(dateFin);
    if (statut === 'en_cours' && !data.dateDebut) data.dateDebut = new Date();
    if (statut === 'terminee' && !data.dateFin) data.dateFin = new Date();
    const o = await prisma.operation.update({ where: { id }, data, include: opInclude });
    res.json(o);
  } catch (e) { next(e); }
});

router.patch('/:id/cloturer', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { photoApresUrl, tonnageKg, categorie } = req.body;
    const tons = tonnageKg !== undefined ? Number(tonnageKg) : 0;
    const result = await prisma.$transaction(async (tx) => {
      const o = await tx.operation.update({
        where: { id },
        data: {
          statut: 'terminee',
          photoApresUrl: photoApresUrl ?? undefined,
          dateFin: new Date(),
          collectedTons: tons > 0 ? tons : undefined
        }
      });
      let dechet = null;
      if (tons > 0) {
        dechet = await tx.dechet.create({
          data: { operationId: id, categorie: categorie || 'mixte', poidsKg: tons, qualite: 'prepare' }
        });
        let stock = await tx.stockEcomer.findUnique({ where: { categorie: dechet.categorie } });
        if (!stock) stock = await tx.stockEcomer.create({ data: { categorie: dechet.categorie, quantiteKg: tons } });
        else stock = await tx.stockEcomer.update({ where: { categorie: dechet.categorie }, data: { quantiteKg: { increment: tons } } });
        await tx.mouvementStock.create({ data: { stockId: stock.id, type: 'entree', quantiteKg: tons, motif: 'Clôture opération ECOMER', referenceId: dechet.id } });
      }
      return { operation: o, dechet, tons };
    });
    res.json(result);
  } catch (e) { next(e); }
});

router.post('/:id/dechets', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const { categorie, poidsKg, qualite = 'trie' } = req.body;
    if (!categorie || Number(poidsKg) <= 0) return res.status(422).json({ detail: 'categorie et poidsKg positif sont requis.' });
    const result = await prisma.$transaction(async (tx) => {
      const d = await tx.dechet.create({ data: { operationId: Number(req.params.id), categorie, poidsKg: Number(poidsKg), qualite } });
      let stock = await tx.stockEcomer.findUnique({ where: { categorie } });
      if (!stock) stock = await tx.stockEcomer.create({ data: { categorie, quantiteKg: Number(poidsKg) } });
      else stock = await tx.stockEcomer.update({ where: { categorie }, data: { quantiteKg: { increment: Number(poidsKg) } } });
      await tx.mouvementStock.create({ data: { stockId: stock.id, type: 'entree', quantiteKg: Number(poidsKg), motif: 'Collecte opération ECOMER', referenceId: d.id } });
      return { dechet: d, stock };
    });
    res.status(201).json(result);
  } catch (e) { next(e); }
});

module.exports = router;