FROM node:20-alpine AS base
WORKDIR /app

COPY packages/common ./packages/common
WORKDIR /app/packages/common
RUN npm install --omit=dev

WORKDIR /app
COPY services/reporting-service/package*.json ./services/reporting-service/
WORKDIR /app/services/reporting-service
RUN npm install --omit=dev

COPY services/reporting-service ./

EXPOSE 4006

CMD [ "node", "server.js" ]