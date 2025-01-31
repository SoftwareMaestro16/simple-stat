# Используем официальный образ Node.js с поддержкой необходимых библиотек
FROM node:20

# Устанавливаем системные зависимости, нужные для canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Создаём рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Удаляем node_modules перед установкой
RUN rm -rf node_modules && npm cache clean --force

# Устанавливаем зависимости с пересборкой `canvas`
RUN npm install --omit=dev --build-from-source

# Копируем весь проект в контейнер
COPY . .

# Запуск бота
CMD ["node", "bot.js"]