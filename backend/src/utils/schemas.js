const { z } = require('zod');

const email = z.string().trim().email('Email invalide.');
const passwordMin8 = z.string().min(8, 'Mot de passe : 8 caractères minimum.');
const telephone = z.string().max(40).optional();
const nom = z.string().trim().min(1, 'nom est requis.').max(190);

// Nombre accepté via JSON (number) ou multipart (string), mais jamais les
// chaînes vides (sinon la coercition produirait silencieusement 0).
const numeric = z.union([z.number(), z.string().trim().min(1)]).transform((v) => {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) throw new Error('Doit être un nombre fini.');
  return n;
});

const inscriptionCitoyen = z.object({
  nom,
  email,
  telephone,
  password: passwordMin8,
  operateurMobile: z.string().max(60).optional()
});

const inscriptionRecycleur = z.object({
  nom,
  email,
  telephone,
  password: passwordMin8,
  entreprise: z.string().trim().min(1, 'entreprise est requise.').max(190),
  typesMateriaux: z.array(z.string()).default([]).optional()
});

const login = z.object({
  email: z.string().trim().min(1, 'email est requis.'),
  password: z.string().min(1, 'password est requis.')
});

const register = z.object({
  nom,
  email,
  telephone,
  password: passwordMin8,
  role: z.enum(['citoyen', 'recycleur', 'agent']).default('citoyen'),
  ville: z.string().max(80).optional(),
  organisationNom: z.string().max(190).optional(),
  typesMateriaux: z.array(z.string()).default([]).optional()
});

// signalement : latitude/longitude validées (types coercibles), reste en passthrough
// (photoUrl/suggestionIa/description/gravite peuvent venir du multipart ou du JSON).
const signalement = z.object({
  latitude: numeric,
  longitude: numeric
}).passthrough();

const appelOffres = z.object({
  zoneId: numeric,
  type: z.string().trim().min(1, 'type est requis.'),
  dateIntervention: z.string().trim().min(1, 'dateIntervention est requise.')
}).passthrough();

const operation = z.object({
  zoneId: numeric
}).passthrough();

const lotEcoshop = z.object({
  categorie: z.string().trim().min(1, 'categorie est requise.'),
  quantiteKg: numeric,
  prixUnitaire: numeric
}).passthrough();

const commandeEcoshop = z.object({
  lotId: numeric,
  quantiteKg: numeric
}).passthrough();

module.exports = {
  inscriptionCitoyen,
  inscriptionRecycleur,
  login,
  register,
  signalement,
  appelOffres,
  operation,
  lotEcoshop,
  commandeEcoshop
};