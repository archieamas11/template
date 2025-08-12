# Stage 1 - Build
FROM oven/bun:1 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the app
RUN bun run build

# Stage 2 - Serve
FROM oven/bun:1 AS runner

WORKDIR /app

# Copy only the built files and package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

# Install only production deps (if any)
RUN bun install --production --frozen-lockfile

# Expose the port Vite preview will run on
EXPOSE 4173

# Start the app
CMD ["bun", "run", "preview"]
