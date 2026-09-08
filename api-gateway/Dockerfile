FROM node:20-alpine AS base
WORKDIR /app

COPY packages/common ./packages/common
WORKDIR /app/packages/common
RUN npm install --omit=dev

WORKDIR /app
COPY api-gateway/package*.json  ./api-gateway/
WORKDIR /app/api-gateway
RUN npm install --omit=dev

COPY api-gateway ./

EXPOSE 4000

CMD [ "node", "server.js" ]