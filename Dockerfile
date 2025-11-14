# Step 1: Build stage
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Step 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built React app from build stage
COPY --from=build-stage /app/build ./build

# Copy server and necessary files
COPY server.js ./
COPY view-analytics.js ./

# Create analytics directory
RUN mkdir -p /app/analytics

# Set environment variables with defaults
ENV PORT=3001
ENV NODE_ENV=production
ENV ANALYTICS_PASSWORD=changeme

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/analytics/summary', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "server.js"]
