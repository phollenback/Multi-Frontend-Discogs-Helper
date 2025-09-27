# ---- Base ----
    FROM node:20-alpine AS base
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Install OS deps if you need them (e.g., openssl, curl)
    RUN apk add --no-cache tini
    
# ---- Dependencies ----
FROM base AS deps
WORKDIR /app
COPY package*.json ./
# Install all dependencies including dev dependencies for TypeScript compilation
RUN npm install
    
# ---- Build (TypeScript compilation) ----
FROM deps AS build
WORKDIR /app
COPY . .
# TypeScript is already compiled at runtime with ts-node, so we just copy source files
    
# ---- Runtime ----
FROM base AS runtime
WORKDIR /app

# Copy dependencies and source files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app ./

# Ensure the container shuts down cleanly
ENTRYPOINT ["/sbin/tini","--"]

# Default port used by the API
ENV PORT=3001
EXPOSE 3001

# Start the TypeScript application with ts-node
CMD ["npm", "start"]
    