# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Copy and install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build command
RUN npm run build

# Stage 2: Serve the production build with NGINX
FROM nginx:stable-alpine

# Copy built React app
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]