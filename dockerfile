# Step 1: Node build stage
FROM node:16 as build-stage

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies and specific babel plugin
RUN npm install
RUN npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Step 2: Run stage with Node.js
FROM node:16

WORKDIR /app

# Copy built static files from the build stage
COPY --from=build-stage /app/build /app/build

# Copy the server-side code into the container
COPY --from=build-stage /app/server.js /app/server.js
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/package-lock.json /app/package-lock.json

# Install production dependencies only
RUN npm install --only=production

# Expose the port your app runs on
EXPOSE 80

# Start your app
CMD ["node", "server.js"]
