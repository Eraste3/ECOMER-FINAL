const router = require('express').Router();
const prisma = require('../config/database');
const { auth, requireRole } = require('../middleware/auth');
const { clusterSignalements } = require('../services/clustering');
const { analyserPhoto } = require('../services/iaClient');
const { uploadPhoto } = require('../config/upload');
const paginate = require('../utils/paginate');
const validate = require('../middleware/validate');
const schemas = require('../utils/schemas');

router.post('/', auth, uploadPhoto, validate(schemas.signalement), async (req, res, next) => {
  try {
    const { latitude, longitude, typeDechet, gravite, suggestionIa, description } = req.body;
    const photoUrl = req.photoUrl || req.body.photoUrl;
    if (!photoUrl || latitude === undefined || longitude === undefined) return res.status(422).json({ detail: 'photoUrl, latitude et longitude sont requis.' });

    const s = await prisma.signalement.create({
      data: {
        photoUrl, latitude: Number(latitude), longitude: Number(longitude),
        typeDechet, gravite, description, suggestionIa,
        utilisateurId: req.user.id
      }
    });

    // Analyse IA en arrière-plan : on répond tout de suite au citoyen (pas de
    // blocage réseau jusqu'à 20s), puis on met à jour suggestionIa/typeDechet.
    const photoAbsolue = /^https?:\/\//i.test(photoUrl)
      ? photoUrl
      : `${req.protocol}://${req.get('host')}${photoUrl}`;
    void lancerAnalyseIa(s.id, photoAbsolue, typeDechet);

    res.status(201).json({ ...s, analyseIa: { statut: 'en_cours' } });
  } catch (e) { next(e); }
});

async function lancerAnalyseIa(signalementId, photoAbsolue, typeDechetInitial) {
  try {
    const analyse = await analyserPhoto(photoAbsolue);
    if (!analyse) return;
    const data = {};
    if (analyse.typeDechet && !typeDechetInitial) data.typeDechet = analyse.typeDechet;
    data.suggestionIa = JSON.stringify({
      confiance: analyse.confiance,
      detections: analyse.detections,
      message: analyse.message
    });
    await prisma.signalement.update({ where: { id: signalementId }, data });
  } catch (e) {
    await prisma.signalement.update({
      where: { id: signalementId },
      data: { suggestionIa: JSON.stringify({ attention: 'Analyse IA indisponible : ' + e.message }) }
    }).catch(() => { /* signalement peut avoir été supprimé */ });
  }
}

router.get('/mes-signalements', auth, async (req, res, next) => {
  try {
    res.json(await prisma.signalement.findMany({
      where: { utilisateurId: req.user.id },
      include: { zone: true },
      orderBy: { createdAt: 'desc' }
    }));
  } catch (e) { next(e); }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(422).json({ detail: 'Identifiant invalide.' });
    const s = await prisma.signalement.findUnique({
      where: { id },
      include: { utilisateur: { select: { id: true, nom: true, email: true, role: true } }, zone: true }
    });
    if (!s) return res.status(404).json({ detail: 'Signalement introuvable.' });
    res.json(s);
  } catch (e) { next(e); }
});

router.patch('/:id/valider', auth, requireRole('admin', 'agent'), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(422).json({ detail: 'Identifiant invalide.' });
    const s = await prisma.signalement.update({
      where: { id },
      data: { statut: req.body.statut || 'valide', gravite: req.body.gravite ?? undefined, typeDechet: req.body.typeDechet ?? undefined }
    });
    if (s.statut === 'valide' || s.statut === 'rejete') await clusterSignalements();
    res.json(s);
  } catch (e) { next(e); }
});

router.get('/', auth, async (req, res, next) => {
  try {
    const { enabled, skip, take } = paginate(req);
    res.json(await prisma.signalement.findMany({
      include: { utilisateur: { select: { id: true, nom: true, email: true, role: true } }, zone: true },
      orderBy: { createdAt: 'desc' },
      ...(enabled ? { skip, take } : {})
    }));
  } catch (e) { next(e); }
});

module.exports = router;