FROM node:20-alpine AS base
WORKDIR /app

COPY packages/common ./packages/common
WORKDIR /app/packages/common
RUN npm install --omit=dev

WORKDIR /app
COPY services/booking-service/package*.json ./services/booking-service/
WORKDIR /app/services/booking-service
RUN npm install --omit=dev

COPY services/booking-service ./

EXPOSE 4002

CMD [ "node", "server.js" ]