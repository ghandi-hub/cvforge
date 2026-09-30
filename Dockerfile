# Stage 1: Build the SvelteKit application using Bun
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile || bun install

# Copy source code
COPY . .

# Build application with adapter-node
RUN bun run build

# Stage 2: Production runtime with Bun
FROM oven/bun:latest AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy package and built output
COPY package.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "build/index.js"]
