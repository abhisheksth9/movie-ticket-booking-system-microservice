FROM node:20-alpine AS base
WORKDIR /app

COPY packages/common ./packages/common
WORKDIR /app/packages/common
RUN npm install --omit=dev

WORKDIR /app
COPY services/notification-service/package*.json ./services/notification-service/
WORKDIR /app/services/notification-service
RUN npm install --omit=dev

COPY services/notification-service ./

EXPOSE 4005

CMD [ "node", "server.js" ]