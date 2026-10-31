# syntax=docker/dockerfile:1@sha256:4edf897a3ffa55b89f906fc8cc78afdb3f1834cc9c7083565e611a8a7d5fe99e

FROM oven/bun:1.4.4@sha256:1d22548f177f4ff38e0c15baa3c2c46c6c2060ba2d1bc573bb4720b407548f1d AS base
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
# Under the oven/bun builder, Nitro's tracer bundles react-dom's bun/edge server
# variants but omits server.node.js, which the node-server runtime imports at
# runtime (ERR_MODULE_NOT_FOUND, crash-loops the pod). Copy the complete react-dom
# into the traced output so the node entry and its cjs deps are present
RUN cp -rn node_modules/react-dom/. .output/server/node_modules/react-dom/
# Fail the build loudly if server.node.js is still missing
RUN test -f .output/server/node_modules/react-dom/server.node.js \
  || (echo "ERROR: react-dom/server.node.js missing from .output" && exit 1)

# Bun doesn't properly resolve externalized Nitro packages (srvx, react-dom/server),
# so run under node (slim, glibc to match the oven/bun builder) with the builder's
# node_modules copied in for those externalized runtime deps
FROM node:22-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
