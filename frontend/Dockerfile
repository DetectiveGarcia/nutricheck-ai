# frontend/Dockerfile

FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose typical Expo ports
EXPOSE 8081 19000 19001 19002

# Run Expo in tunnel mode (good for mobile testing)
CMD ["npx", "expo", "start", "--lan"]

