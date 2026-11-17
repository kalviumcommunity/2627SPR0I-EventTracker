# Use an official Node.js runtime
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the backend application
COPY . .

# Default application port
ENV PORT=5000

# Document the listening port
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
