# ---------- STAGE 1: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm ci

# Копируем остальные файлы
COPY . .

# Билдим Next.js
RUN npm run build

# ---------- STAGE 2: Runner ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Устанавливаем переменные среды
ENV NODE_ENV=production

# Копируем package.json и lock
COPY package.json package-lock.json ./

# Устанавливаем только прод-зависимости
RUN npm ci --omit=dev

# Копируем билд и публичные файлы
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js .

# Устанавливаем переменные среды
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]