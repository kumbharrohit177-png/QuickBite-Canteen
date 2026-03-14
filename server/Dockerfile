# ---- Base Stage ----
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /app

# Create uploads directory
RUN mkdir -p uploads

# Copy deps from base
COPY --from=base /app/node_modules ./node_modules

# Copy source
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
