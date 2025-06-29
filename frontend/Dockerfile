# Use official Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend source
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Use Vite's dev server
CMD ["npm", "run", "dev"]
