# Multi-stage build for React application
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Accept build arguments for environment variables
# These are passed at build time and embedded in the React bundle
ARG REACT_APP_CONTRACT_ADDRESS
ARG REACT_APP_NETWORK_ID

# Set environment variables for React build
ENV REACT_APP_CONTRACT_ADDRESS=$REACT_APP_CONTRACT_ADDRESS
ENV REACT_APP_NETWORK_ID=$REACT_APP_NETWORK_ID

# Copy package files from frontend directory
COPY frontend/package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm install

# Copy source code from frontend directory
COPY frontend/ .

# Build the application (environment variables are embedded at build time)
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration from root directory
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

