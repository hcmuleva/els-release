FROM node:20-bullseye

# Install required system deps for Strapi with SQLite
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    make \
    g++ \
    libvips-dev \
    libpng-dev \
    zlib1g-dev \
    nasm \
    bash \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

COPY entrypoint.sh /opt/entrypoint.sh
RUN chmod +x /opt/entrypoint.sh

EXPOSE 1337

ENTRYPOINT ["/opt/entrypoint.sh"]
