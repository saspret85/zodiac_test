FROM node:22-alpine

WORKDIR /app

RUN npm install -g bun

# Copy package files
COPY package.json bun.lock ./
RUN bun install

# Copy prisma schema
COPY prisma ./prisma/

# Copy prisma config - This is critical for Prisma 7
COPY prisma.config.ts ./

# Generate client with the config file
RUN bunx prisma generate --config prisma.config.ts

# Copy everything else
COPY . .

EXPOSE 3000

# Prisma 7 migration approach: use db push for now or migrate deploy with config
CMD ["sh", "-c", "bunx prisma db push --accept-data-loss --config prisma.config.ts && bun src/app.ts"]
