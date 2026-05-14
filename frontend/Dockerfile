# Build stage menggunakan Node.js 22 dan Bun terbaru
FROM node:22-alpine as build

WORKDIR /app

# Install Bun terbaru
RUN npm install -g bun

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

# Production stage menggunakan Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
