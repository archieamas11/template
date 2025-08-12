# ---- Build Stage ----
FROM oven/bun:1 AS builder
WORKDIR /app

# Pass Vite envs at build-time via build args (set them in Coolify)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Copy only dependency files first for better caching
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the app (Vite reads VITE_* from the environment at build time)
RUN bun run build

# ---- Production Stage ----
FROM nginx:1.27-alpine AS runner

# Copy nginx config for SPA routing and caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose web port used by Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
