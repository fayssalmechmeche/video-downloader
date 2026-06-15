# je crée une image basée sur l'image officielle de Node.js version 20 avec Alpine Linux
FROM node:20-alpine

# je crée un dossier pour le frontend
EXPOSE 5173

# je crée un dossier pour le frontend
WORKDIR /app

# je copie les fichiers package.json et package-lock.json dans le conteneur
COPY package.json package-lock.json ./

# j'installe les dépendances du projet
RUN npm install

# je copie tous les fichiers du projet dans le conteneur
COPY . .

# je lance le projet en mode développement
CMD ["npm","run","start"]