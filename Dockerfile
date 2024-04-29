# Step 1: Node build stage
FROM node:16 as build-stage

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies and specific babel plugin
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN npm run build --prod --nomaps

FROM nginx:stable-alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY ./deployment/nginx.conf /etc/nginx/conf.d/default.conf
