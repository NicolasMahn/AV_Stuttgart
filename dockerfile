# Step 1: Build stage
# Use an official Node image as the base image
FROM node:16 as build-stage

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build

# Step 2: Serve stage
# Use nginx to serve the static content
FROM nginx:stable-alpine as serve-stage

# Copy the build output from the build stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
