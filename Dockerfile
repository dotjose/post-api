# Stage 1: Build the NestJS app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

# Stage 2: Run the app with a minimal image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]