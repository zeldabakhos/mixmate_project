FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

RUN npm install

# Copy all files
COPY . .

EXPOSE 3000

CMD ["npm", "start"]