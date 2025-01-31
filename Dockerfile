FROM node:20

# Устанавливаем системные зависимости для canvas
RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package.json и package-lock.json и УДАЛЯЕМ node_modules
COPY package.json package-lock.json ./
RUN rm -rf node_modules && npm install --omit=dev

# ПЕРЕСБИРАЕМ canvas
RUN npm rebuild canvas --build-from-source

# Копируем остальной код
COPY . .

CMD ["npm", "start"]