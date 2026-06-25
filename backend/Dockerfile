# je crée une image basée sur l'image officielle de Node.js version 20 avec Alpine Linux
FROM node:20-alpine

# je crée un dossier pour le backend
WORKDIR /app

# j'installe les dépendances nécessaires pour le projet
RUN apk add --no-cache python3 py3-pip ffmpeg
RUN pip3 install yt-dlp --break-system-packages

# je copie les fichiers package.json et package-lock.json dans le conteneur
COPY package.json package-lock.json ./

# j'installe les dépendances du projet
RUN npm install

# je copie tous les fichiers du projet dans le conteneur
COPY . .

# je construis le projet
RUN npm run build

# je lance le projet en mode production
CMD ["npm", "run", "start:prod"]