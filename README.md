# ECOMER - Plateforme de Gestion Environnementale

Plateforme complète de gestion des déchets et de la pollution avec IA intégrée.

## Architecture

- **Backend** : Express.js + Prisma + PostgreSQL
- **Frontend** : React + TypeScript + Vite
- **Service IA** : FastAPI + YOLOv8 (analyse d'images)

## Structure du projet

```
ECOMER-FINAL/
├── backend/          # API Express.js
│   ├── src/
│   ├── prisma/
│   ├── ia-service/   # Service Python IA
│   └── ...
├── frontend/         # Application React
│   ├── src/
│   └── ...
├── package.json      # Scripts globaux
└── README.md
```

## Installation

### Installer toutes les dépendances

```bash
npm run install:all
```

Ou manuellement :

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Configuration

### Backend

```bash
cd backend
copy .env.example .env
```

Configurez les variables dans `backend/.env` :
- `DATABASE_URL` : PostgreSQL/Neon
- `JWT_SECRET` : Secret pour les tokens
- `CLOUDINARY_*` : Stockage images (production)
- `IA_SERVICE_URL` : URL du service IA

### Frontend

```bash
cd frontend
copy .env.example .env
```

Configurez dans `frontend/.env` :
- `VITE_API_BASE_URL` : URL du backend (http://localhost:8000 en local)

## Démarrage

### Démarrer tout (backend + frontend)

```bash
npm run dev
```

### Démarrer uniquement le backend

```bash
npm run dev:backend
```

### Démarrer uniquement le frontend

```bash
npm run dev:frontend
```

### Service IA (optionnel)

```bash
cd backend/ia-service
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8501
```

## Base de données

### Générer Prisma Client

```bash
npm run prisma:generate
```

### Créer les tables

```bash
npm run prisma:migrate
```

### Données de démonstration

```bash
npm run prisma:seed
```

Compte admin démo : `admin@ecomer.cg` / `Admin12345!`

### Prisma Studio (GUI)

```bash
npm run prisma:studio
```

## Build pour production

```bash
npm run build:frontend
```

## Déploiement sur Render

### Backend + Service IA

Le fichier `backend/render.yaml` contient la configuration pour déployer :
- `ecomer-api` : Backend Express.js
- `ecomer-ia` : Service IA Python

### Frontend

Le fichier `frontend/render.yaml` contient la configuration pour déployer :
- `ecomer-frontend` : Application React

### Ordre de déploiement

1. Déployer le backend (`ecomer-api`)
2. Déployer le service IA (`ecomer-ia`)
3. Récupérer l'URL du backend
4. Déployer le frontend avec cette URL dans `VITE_API_BASE_URL`

## Sécurité

- `JWT_SECRET` doit être un secret fort
- `IA_API_KEY` doit être identique dans le backend et le service IA
- Le service IA bloque les URLs privées (anti-SSRF)
- Les tokens sont révoqués à la déconnexion

## Technologies

### Backend
- Express.js 5.1.0
- Prisma 6.19.0
- PostgreSQL
- JWT (jsonwebtoken)
- Multer + Cloudinary
- Zod (validation)

### Frontend
- React 18.3.1
- TypeScript 5.5.4
- Vite 5.2.0
- Axios 1.7.9
- React Router 6.26.2
- TailwindCSS 3.4.17

### Service IA
- FastAPI
- YOLOv8 (Ultralytics)
- ONNX Runtime
