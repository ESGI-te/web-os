# Use an official Node.js runtime as a parent image
FROM node:18.0.0

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Vite app for production
RUN npm run build

# Set the command to start the app
CMD [ "npm", "run", "start" ]
