FROM node:20-alpine AS base
WORKDIR /app

COPY packages/common ./packages/common
WORKDIR /app/packages/common
RUN npm install --omit=dev

WORKDIR /app
COPY services/payment-service/package*.json ./services/payment-service/
WORKDIR /app/services/payment-service
RUN npm install --omit=dev

COPY services/payment-service ./

EXPOSE 4004

CMD [ "node", "server.js" ]