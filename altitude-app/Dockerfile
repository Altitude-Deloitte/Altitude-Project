# Stage 1: Build the Angular Universal app
FROM node:20-alpine AS build
 
WORKDIR /usr/src/app
 
# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
 
# Copy the rest of the project
COPY . .
 
# Build the SSR app
RUN npm run build
 
# Stage 2: Serve the Angular Universal app
FROM node:20-alpine
 
WORKDIR /usr/src/app
 
# Copy built files from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
 
# Install production dependencies only
RUN npm install --omit=dev
 
# Expose port 8080 (Cloud Run default)
EXPOSE 8080
 
# Run the SSR server
CMD ["node", "dist/altitude-app/server/server.mjs"]
 
 