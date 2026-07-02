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
# Cache-bust marker to force a fresh Vite/Nitro build layer
ARG BUILD_TOKEN=2026-07-02-cb1
RUN echo "build token: $BUILD_TOKEN" && bun run build
# Fail the build loudly if Nitro traced react-dom without server.node.js
# (the node-server runtime imports it; a missing file crash-loops the pod)
RUN test -f .output/server/node_modules/react-dom/server.node.js \
  || (echo "ERROR: react-dom/server.node.js missing from .output" && exit 1)

# Bun doesn't properly resolve externalized Nitro packages (srvx, react-dom/server),
# so run under node (slim, glibc to match the oven/bun builder) with the builder's
# node_modules copied in for those externalized runtime deps
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
