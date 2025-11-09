FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 1337

# Start Strapi in development mode with hot reload
CMD ["npm", "run", "develop"]