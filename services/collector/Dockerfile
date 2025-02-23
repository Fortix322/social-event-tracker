FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./

COPY --from=builder /app/src/prisma ./src/prisma

RUN npm install

RUN npx prisma generate

COPY --from=builder /app/dist ./dist

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
