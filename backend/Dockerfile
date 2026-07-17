FROM node:18-alpine

WORKDIR /app

# Copy package files from backend directory
COPY apps/backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend application files
COPY apps/backend/ ./

# Build the NestJS application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]

