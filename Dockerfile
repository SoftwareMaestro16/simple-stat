FROM node:20

RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  librsvg2-dev \
  libpangocairo-1.0-0 \
  librsvg2-common

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm rebuild canvas --build-from-source

COPY . .
CMD ["npm", "start"]