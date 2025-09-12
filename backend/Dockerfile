# 🏗️ Runtime variable: Node.js version
ARG NODE_VERSION=22

################################################################################
# * STAGE 1 : BASE 🟦
################################################################################

# Use Node.js slim image as the base layer
FROM node:${NODE_VERSION}-bookworm-slim as base 

################################################################################
# * STAGE 2 : DEPENDENCIES 📦 
################################################################################

# Installing dependencies using base
FROM base as deps

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install package
RUN npm ci

################################################################################
# * STAGE 3 : BUILD 🔨
################################################################################

# Initiate build
FROM deps as build

# Create app directory
WORKDIR /app

# Copy the rest of the source files into the image.
COPY . .

# Build TS → JS
RUN npm run build

# Install ncc package
RUN npm i -g @vercel/ncc

# Create build in dist directory
RUN ncc build dist/index.js -o build

################################################################################
# * STAGE 4 : PRODUCTION 🚀
################################################################################

# Distroless image for production
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12 as prod

# Set working directory
WORKDIR /app

# Copy require files from previous stage
COPY --from=build /app/build/ .

# Container command
CMD ["index.js"]