# 🏗️ Runtime build variable: Node.js version
ARG NODE_VERSION=22

################################################################################
# * STAGE 1: BUILD 🔨
################################################################################

# Use Node.js slim image for building the app
FROM node:${NODE_VERSION}-bookworm-slim as build

# Set working directory inside container
WORKDIR /app

# Copy only package.json and package-lock.json
COPY package*.json ./

# Install dependencies exactly as defined in package-lock.json
RUN npm ci

# Copy the rest of the app source code
COPY . .

# Build the Next.js standalone app (generates .next folder)
RUN npm run build


################################################################################
# * STAGE 2: PRODUCTION 🚀
################################################################################

# Use distroless Node.js image for production
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12 as prod

# Set working directory
WORKDIR /app

# Copy built standalone app from the build stage
COPY --from=build /app/.next/standalone ./

# Copy static assets
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Default command to run the standalone Next.js server
CMD ["server.js"]
