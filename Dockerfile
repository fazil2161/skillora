FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Copy source code
COPY client/ ./client/
COPY server/ ./server/

# Install dependencies and build
RUN cd client && npm install
RUN cd server && npm install
RUN cd client && npm run build

# Set the working directory to server
WORKDIR /app/server

# Start the server
CMD ["node", "src/index.js"] 