FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./

RUN npm install

COPY --from=builder /app/dist ./dist

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

CMD ["npm", "run", "start:prod"]
