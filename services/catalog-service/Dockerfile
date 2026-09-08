FROM node:20-alpine AS base
WORKDIR /app

COPY packages/common ./packages/common
WORKDIR /app/packages/common
RUN npm install --omit=dev

WORKDIR /app
COPY services/catalog-service/package*.json ./services/catalog-service/
WORKDIR /app/services/catalog-service
RUN npm install --omit=dev

COPY services/catalog-service ./

EXPOSE 4003

CMD [ "node", "server.js" ]