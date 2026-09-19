# ECOMER V3 — Express + Prisma + PostgreSQL

Version Express.js du backend ECOMER avec Prisma comme ORM et générateur de schéma de base de données.

## 1. Installation

```cmd
npm install
```

Si `npm install` échoue à cause de ton installation npm, ne modifie pas le code : envoie-moi l'erreur complète.

## 2. Configuration

Copie `.env.example` vers `.env` :

```cmd
copy .env.example .env
```

Puis renseigne `DATABASE_URL` et `JWT_SECRET`. Le `.env` est ignoré par Git.

## 3. Générer Prisma Client

```cmd
npx prisma generate
```

## 4. Créer la base et les tables

Avec PostgreSQL/Neon disponible :

```cmd
npx prisma migrate dev --name init
```

Prisma crée les tables définies dans `prisma/schema.prisma`.

## 5. Données de démonstration facultatives

```cmd
npm run prisma:seed
```

Compte admin de démo : `admin@ecomer.cg` / `Admin12345!` — à changer immédiatement en environnement réel.

## 6. Démarrer

```cmd
npm run dev
```

API : http://localhost:8000

## 7. Service IA (analyse photo YOLO)

Le backend appelle un micro-service Python (FastAPI + Ultralytics YOLOv8) pour analyser
la photo d'un signalement au moment de sa création : il détecte les objets présents,
déduit un `typeDechet` dominant et stocke le détail dans `suggestionIa` (JSON).

```cmd
cd ia-service
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8501
```

- Si `IA_API_KEY` est renseignée dans `backend/.env`, lance le service avec la MÊME clé :
  `set IA_API_KEY=votre_clé` avant `uvicorn` (sinon le backend recevra des réponses 401 en mode dégradé).
- Le service bloque par défaut les téléchargements vers des adresses privées/réservées
  (anti-SSRF). En dev local uniquement, `IA_ALLOW_PRIVATE=1` autorise `http://localhost`.

- Démarre sur `http://localhost:8501` (endpoints : `GET /health`, `POST /analyser`).
- Le modèle `yolov8n.onnx` (COCO) est empaqueté dans le conteneur IA.
  Il peut être remplacé via `YOLO_MODEL` (chemin local ou id Ultralytics `.pt` téléchargé au premier lancement).
- Le backend utilise `IA_SERVICE_URL` (voir `.env`) pour l'appeler ; laisser vide pour désactiver l'analyse.
- Si l'analyse IA échoue, le signalement est quand même créé (fonctionnement dégradé) : la réponse
  contient alors un champ `analyseIa.attention`.

Exemples de test :

```cmd
curl http://localhost:8501/health
curl -X POST http://localhost:8501/analyser -H "Content-Type: application/json" -d "{\"photoUrl\":\"https://.../photo.jpg\"}"
```

## 8. Prisma Studio

```cmd
npm run prisma:studio
```

## Sécurité

- `JWT_SECRET` doit être un secret fort (`openssl rand -base64 48`). Les anciens tokens
  sont invalidés à chaque changement de secret.
- Le logout révoque réellement le token (table `TokenInvalide`) : un token déconnecté
  devient refusé par `auth`, y compris sur `/refresh`.
- `IA_API_KEY` doit être renseignée et IDENTIQUE dans le backend et le service IA.
- Le service IA bloque les URLs vers des adresses privées/réservées (anti-SSRF) ;
  laissez `IA_ALLOW_PRIVATE=0` en production.

## Pagination

La plupart des listes (`/signalements`, `/operations`, `/appels-offres`, `/users`,
`/notifications`, `/ecoshop/lots`, `/ecoshop/commandes`, `/equipes`, `/recycleurs`)
acceptent `?page=1&limit=50` (limite plafonnée à 500). Sans paramètres, tout est
retourné (comportement historique conservé).

## Routes principales

- `POST /api/v1/auth/inscription/citoyen`
- `POST /api/v1/auth/inscription/recycleur`
- `POST /api/v1/auth/login`
- `POST /api/v1/signalements`
- `GET /api/v1/signalements/mes-signalements`
- `PATCH /api/v1/signalements/:id/valider`
- `GET /api/v1/zones`
- `GET /api/v1/zones/prioritaires`
- `POST /api/v1/appels-offres`
- `POST /api/v1/appels-offres/:id/participer`
- `POST /api/v1/operations`
- `PATCH /api/v1/operations/:id/cloturer`
- `POST /api/v1/operations/:id/dechets`
- `GET /api/v1/ecoshop/lots`
- `POST /api/v1/ecoshop/lots`
- `POST /api/v1/ecoshop/commandes`
- `GET /api/v1/dashboard/ecomer`
- `GET /api/v1/dashboard/citoyen`

## Architecture

Citoyen → Signalement → Zone de pollution → Appel d'offres → Participation → Opération → Déchets pesés → Stock → ECOSHOP → Recycleur → Commande.

Le clustering géographique est réalisé en JavaScript (DBSCAN/Haversine, `src/services/clustering.js`).
La détection d'image est déléguée au micro-service Python `ia-service` (YOLOv8), appelée par ce backend
via HTTP au moment de la création d'un signalement (cf. §7).
