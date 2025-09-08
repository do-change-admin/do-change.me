FROM node:20-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json ./
RUN npm ci

# Копируем остальные файлы
COPY . .

# Устанавливаем переменные среды
ENV NODE_ENV=production

# Сборка Next.js (с поддержкой src/)
RUN npm run build
EXPOSE 3000

CMD ["npm", "start"]