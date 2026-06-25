# SocialMediaDL

Téléchargez des vidéos TikTok et Twitter/X en un clic.

🌐 **[socialmediaDL.vercel.app](https://video-downloader-azure-chi.vercel.app)**

## Stack

- **Frontend** : React, Vite, TypeScript, Tailwind CSS, PWA
- **Backend** : NestJS, TypeScript, yt-dlp, Docker
- **Déploiement** : Vercel (front) + Railway (back)

## Fonctionnalités

- Téléchargement de vidéos TikTok et Twitter/X
- Validation des URLs avec Zod
- Rate limiting (3 requêtes/minute par IP)
- Limite de taille de fichier (100MB)
- PWA installable sur mobile iOS et Android

## Lancer en local

### Prérequis

- Docker
- Docker Compose

### Installation

```bash
git clone https://github.com/fayssalmechmeche/video-downloader.git
cd video-downloader
docker compose up --build
```

- Frontend : http://localhost:5173
- Backend : http://localhost:3000

## Roadmap v2

- Téléchargement de photos
- Sélection de la qualité vidéo (1080p, 720p, 480p)
- Support de plateformes supplémentaires
- Prévisualisation des médias avant téléchargement
