FROM node:22-bookworm-slim

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/prisma ./prisma
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

COPY backend/src ./src

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]