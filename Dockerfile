# syntax=docker/dockerfile:1@sha256:ecfaec9ed6d810b56388c508f4121597bfbba70d41a6dfeee4d8cad5f295fc32

FROM oven/bun:1@sha256:e10577f0db68676a7024391c6e5cb4b879ebd17188ab750cf10024a6d700e5c4 AS base
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
FROM node:22-slim@sha256:d649c27dae7ba0137b3cef5dd75baa422c08dc3d9e3fc0c23dfb172dc3cc6436 AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
