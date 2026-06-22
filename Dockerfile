# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base
WORKDIR /app

# Build
FROM base AS builder
# Pin the Nitro preset to node-server so the output runs under the Node runner
# below. Without this, Nitro auto-detects the bun preset when building in the
# oven/bun image and emits Bun.serve, which crashes under node
COPY package.json bun.lock .env.production ./
RUN bun install --frozen-lockfile
COPY . .
ENV NITRO_PRESET=node-server
RUN bun run build

# Bun doesn't properly resolve externalized Nitro packages (srvx, react-dom/server)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
