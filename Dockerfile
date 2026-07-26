# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /app

# Install frontend dependencies first for better layer caching.
COPY frontend/package*.json ./
RUN npm ci

FROM base AS build
WORKDIR /app
COPY frontend/ ./

# Vite env vars are baked into the bundle at build time.
ARG VITE_API_BASE_URL="http://host.docker.internal:3000/api"
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# For the provided command, duplicated BUILD_COMMAND keeps the last value.
# If that value is a preview command, fall back to a proper build command.
ARG BUILD_COMMAND="npm run build"
RUN if echo "$BUILD_COMMAND" | grep -q "preview"; then \
      npm run build; \
    else \
      sh -c "$BUILD_COMMAND"; \
    fi

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app /app

# Default runtime command for Vite preview inside container.
ARG RUN_COMMAND="npm run preview -- --host 0.0.0.0 --port 3000"
ENV RUN_COMMAND=${RUN_COMMAND}

EXPOSE 3000
CMD ["sh", "-c", "${RUN_COMMAND}"]
