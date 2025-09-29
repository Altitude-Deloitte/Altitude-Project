# Use Nginx to serve static Angular files
FROM nginx:1.27-alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy pre-built Angular dist files
COPY Html-Dist/ /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Cloud Run port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
