const router = require('express').Router();
const prisma = require('../config/database');
const { auth } = require('../middleware/auth');
const paginate = require('../utils/paginate');

router.get('/', auth, async (req, res, next) => {
  try {
    const { enabled, skip, take } = paginate(req);
    res.json(await prisma.notification.findMany({
      where: { utilisateurId: req.user.id },
      orderBy: { createdAt: 'desc' },
      ...(enabled ? { skip, take } : {})
    }));
  } catch (e) { next(e); }
});

router.patch('/tout-marquer-lu', auth, async (req, res, next) => {
  try {
    const result = await prisma.notification.updateMany({
      where: { utilisateurId: req.user.id, lue: false },
      data: { lue: true }
    });
    res.json({ count: result.count });
  } catch (e) { next(e); }
});

router.patch('/:id/lue', auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(422).json({ detail: 'Identifiant invalide.' });
    const n = await prisma.notification.updateMany({
      where: { id, utilisateurId: req.user.id },
      data: { lue: true }
    });
    if (n.count === 0) return res.status(404).json({ detail: 'Notification introuvable.' });
    res.json({ id, lue: true });
  } catch (e) { next(e); }
});

module.exports = router;