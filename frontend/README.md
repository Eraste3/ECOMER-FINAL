# ECOMER Frontend - React + TypeScript + Vite

Frontend de la plateforme ECOMER connecté au backend Express.js.

## Installation

```bash
npm install
```

## Configuration

Copiez `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Puis configurez l'URL de l'API backend :

```env
VITE_API_BASE_URL=http://localhost:8000
```

En production (Render), utilisez l'URL du backend déployé :

```env
VITE_API_BASE_URL=https://ecomer-api.onrender.com
```

## Démarrage

```bash
npm run dev
```

L'application sera accessible sur http://localhost:5173

## Build pour production

```bash
npm run build
```

## Services API disponibles

- **Authentification** : Login, inscription citoyen/recycleur
- **Signalements** : Création, liste, validation
- **ECOSHOP** : Lots, commandes

## Hooks React personnalisés

- `useAuth()` : Gestion de l'authentification
- `useSignalements()` : Gestion des signalements
- `useEcoshop()` : Gestion de l'ECOSHOP

## Déploiement sur Render

Le fichier `render.yaml` contient la configuration pour déployer automatiquement sur Render.

Variables d'environnement requises :
- `VITE_API_BASE_URL` : URL du backend ECOMER

## Architecture

- **React 18** : Framework UI
- **TypeScript** : Typage statique
- **Vite** : Build tool
- **Axios** : Client HTTP
- **React Router** : Routing
- **TailwindCSS** : Styling
