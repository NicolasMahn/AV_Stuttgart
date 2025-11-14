# Step 1: Build stage
# node:18-alpine supports both ARM64 and x86_64
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Step 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve globally for React production server and apk for health checks
RUN npm install -g serve && apk add --no-cache wget

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built React app from build stage
COPY --from=build-stage /app/build ./build

# Copy server and necessary files
COPY server.js ./
COPY view-analytics.js ./
COPY startup.sh ./

# Make startup script executable
RUN chmod +x startup.sh

# Create analytics directory
RUN mkdir -p /app/analytics

# Set environment variables with defaults
ENV PORT=3001
ENV REACT_PORT=3000
ENV NODE_ENV=production
# ANALYTICS_PASSWORD should be set via docker-compose environment or .env file

# Expose both ports
EXPOSE 3000 3001

# Health check for both services
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:3000 && wget -q --spider http://localhost:3001/api/analytics/summary || exit 1

# Start both services
CMD ["sh", "startup.sh"]
