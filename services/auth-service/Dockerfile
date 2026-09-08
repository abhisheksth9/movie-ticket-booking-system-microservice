FROM node:20-alpine AS base
WORKDIR /app

COPY packages/common ./packages/common
WORKDIR /app/packages/common
RUN npm install --omit=dev

WORKDIR /app
COPY services/auth-service/package*.json ./services/auth-service/
WORKDIR /app/services/auth-service
RUN npm install --omit=dev

COPY services/auth-service ./

EXPOSE 4001

CMD [ "node", "server.js" ]