
# ---- Build Stage ----
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy only dependency files first for better caching
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the app
RUN bun run build

# ---- Production Stage ----
FROM oven/bun:1 AS runner
WORKDIR /app

# Set environment for production
ENV NODE_ENV=production

# Copy only the built output and minimal files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock* ./

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Expose the port Vite preview will run on
EXPOSE 4173

# Start the app
CMD ["bun", "run", "preview"]
