# Use a Node.js base image
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and tsconfig.json
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Start a new, smaller image for production
FROM node:18

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your app runs on
EXPOSE 3000

# Set the command to run the application
CMD [ "node", "dist/src/index.js" ]

