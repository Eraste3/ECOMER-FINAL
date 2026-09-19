const router = require('express').Router();
const prisma = require('../config/database');
const { hashPassword, comparePassword, signToken, verifyToken } = require('../utils/security');
const { isRevoked, revoke } = require('../utils/revocation');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const schemas = require('../utils/schemas');
const { rateLimit } = require('express-rate-limit');

// Anti brute-force : tentatives de connexion/inscription limitées par IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { detail: 'Trop de tentatives. Réessayez dans quelques minutes.' }
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { detail: 'Trop de tentatives de connexion. Réessayez plus tard.' }
});

function publicUser(u, extra = {}) {
  const { password, ...safe } = u;
  return { ...safe, ...extra };
}

/** Enrichit un utilisateur avec son profil rôle (points, badges, entreprise...) */
async function userProfile(u) {
  const extra = {};
  if (u.role === 'citoyen') {
    const c = await prisma.citoyen.findUnique({
      where: { utilisateurId: u.id },
      include: { badgesAcquis: { include: { badge: true } } }
    });
    if (c) {
      extra.ecoPoints = c.ecoPoints;
      extra.niveau = c.niveau;
      extra.operateurMobile = c.operateurMobile;
      extra.badges = c.badgesAcquis.map((b) => ({
        id: b.badge.id,
        nom: b.badge.nom,
        type: b.badge.nom,
        seuilEcoPoints: b.badge.seuilEcoPoints,
        obtenule: b.createdAt
      }));
    }
  } else if (u.role === 'recycleur') {
    const r = await prisma.recycleur.findUnique({ where: { utilisateurId: u.id } });
    if (r) { extra.entreprise = r.entreprise; extra.typesMateriaux = r.typesMateriaux; }
  }
  return extra;
}

router.post('/inscription/citoyen', authLimiter, validate(schemas.inscriptionCitoyen), async (req, res, next) => {
  try {
    const { nom, email, telephone, password, operateurMobile } = req.body;
    if (!nom || !email || !password || password.length < 8) return res.status(422).json({ detail: 'nom, email et mot de passe (8 caractères minimum) sont requis.' });
    const u = await prisma.utilisateur.create({
      data: { nom, email, telephone, password: await hashPassword(password), role: 'citoyen', citoyen: { create: { operateurMobile } } },
      include: { citoyen: true }
    });
    const extra = await userProfile(u);
    res.status(201).json({ access_token: signToken(u), token_type: 'bearer', utilisateur: publicUser(u, extra) });
  } catch (e) { next(e); }
});

router.post('/inscription/recycleur', authLimiter, validate(schemas.inscriptionRecycleur), async (req, res, next) => {
  try {
    const { nom, email, telephone, password, entreprise, typesMateriaux = [] } = req.body;
    if (!nom || !email || !password || password.length < 8 || !entreprise) return res.status(422).json({ detail: 'Champs obligatoires manquants.' });
    const u = await prisma.utilisateur.create({
      data: { nom, email, telephone, password: await hashPassword(password), role: 'recycleur', recycleur: { create: { entreprise, typesMateriaux } } },
      include: { recycleur: true }
    });
    const extra = await userProfile(u);
    res.status(201).json({ access_token: signToken(u), token_type: 'bearer', utilisateur: publicUser(u, extra) });
  } catch (e) { next(e); }
});

router.post('/login', loginLimiter, validate(schemas.login), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = await prisma.utilisateur.findUnique({ where: { email } });
    if (!u || !(await comparePassword(password, u.password))) return res.status(401).json({ detail: 'Email ou mot de passe incorrect.' });
    if (!u.actif) return res.status(403).json({ detail: 'Compte désactivé. Contactez l\'administrateur.' });
    const extra = await userProfile(u);
    res.json({ access_token: signToken(u), token_type: 'bearer', utilisateur: publicUser(u, extra) });
  } catch (e) { next(e); }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const extra = await userProfile(req.user);
    res.json({ utilisateur: publicUser(req.user, extra) });
  } catch (e) { next(e); }
});

router.patch('/me', auth, async (req, res, next) => {
  try {
    const { nom, telephone } = req.body;
    const data = {};
    if (nom !== undefined) data.nom = nom;
    if (telephone !== undefined) data.telephone = telephone;
    const u = await prisma.utilisateur.update({ where: { id: req.user.id }, data });
    const extra = await userProfile(u);
    res.json({ utilisateur: publicUser(u, extra) });
  } catch (e) { next(e); }
});

router.post('/register', authLimiter, validate(schemas.register), async (req, res, next) => {
  try {
    const { nom, email, telephone, password, role = 'citoyen', ville, organisationNom, typesMateriaux = [] } = req.body;
    if (!nom || !email || !password || password.length < 8) return res.status(422).json({ detail: 'nom, email et mot de passe (8 caractères minimum) sont requis.' });
    if (!['citoyen', 'recycleur', 'agent'].includes(role)) return res.status(422).json({ detail: 'Rôle invalide.' });
    if (role === 'agent') return res.status(403).json({ detail: 'Inscription agent réservée à l\'administrateur.' });
    const data = { nom, email, telephone, password: await hashPassword(password), role };
    let u;
    if (role === 'recycleur') {
      if (!organisationNom) return res.status(422).json({ detail: 'organisationNom est requis pour un recycleur.' });
      u = await prisma.utilisateur.create({
        data: { ...data, recycleur: { create: { entreprise: organisationNom, typesMateriaux } } },
        include: { recycleur: true }
      });
    } else {
      u = await prisma.utilisateur.create({ data: { ...data, citoyen: { create: {} } }, include: { citoyen: true } });
    }
    const extra = await userProfile(u);
    res.status(201).json({ access_token: signToken(u), token_type: 'bearer', utilisateur: publicUser(u, extra) });
  } catch (e) { next(e); }
});

router.post('/refresh', authLimiter, async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ detail: 'Token manquant.' });
    try {
      const payload = verifyToken(header.slice(7));
      if (await isRevoked(payload)) return res.status(401).json({ detail: 'Session révoquée. Reconnectez-vous.' });
      const u = await prisma.utilisateur.findUnique({ where: { id: payload.sub } });
      if (!u || !u.actif) return res.status(401).json({ detail: 'Compte introuvable ou désactivé.' });
      const extra = await userProfile(u);
      res.json({ access_token: signToken(u), token_type: 'bearer', utilisateur: publicUser(u, extra) });
    } catch (e) {
      res.status(401).json({ detail: 'Token invalide ou expiré.' });
    }
  } catch (e) { next(e); }
});

router.post('/logout', auth, async (req, res, next) => {
  try {
    // Révocation réelle : le token actuel devient inutilisable (logout effectif).
    if (req.token) await revoke(req.token);
    res.json({ message: 'Déconnecté.' });
  } catch (e) { next(e); }
});

module.exports = router;