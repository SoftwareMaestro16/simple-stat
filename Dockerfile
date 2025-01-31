# Используем официальный образ Node.js с поддержкой необходимых библиотек
FROM node:20

# Устанавливаем зависимости для сборки модуля canvas
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json перед установкой зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости (включая native-библиотеки)
RUN npm install --omit=dev --build-from-source

# Копируем весь проект в контейнер
COPY . .

# Запуск бота
CMD ["node", "bot.js"]