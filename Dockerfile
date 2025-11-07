# Multi-stage build for React application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Accept build arguments for environment variables
# These are passed at build time and embedded in the React bundle
ARG REACT_APP_CONTRACT_ADDRESS=""
ARG REACT_APP_NETWORK_ID="11155111"
ARG REACT_APP_S3_BUCKET_URL=""

# Set environment variables for React build
ENV REACT_APP_CONTRACT_ADDRESS=$REACT_APP_CONTRACT_ADDRESS
ENV REACT_APP_NETWORK_ID=$REACT_APP_NETWORK_ID
ENV REACT_APP_S3_BUCKET_URL=$REACT_APP_S3_BUCKET_URL

# Copy package files from frontend directory
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source code from frontend directory
COPY frontend/ .

# Set proper permissions
RUN chmod +x node_modules/.bin/*

# Build the application using npx (environment variables are embedded at build time)
# Set CI=false to prevent build failures on warnings
ENV CI=false
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration from frontend directory
RUN pwd && ls -la
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]