# Imagem base Node.js
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY .env.example .env

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
