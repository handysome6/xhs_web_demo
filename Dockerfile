FROM node:20-alpine

WORKDIR /app

# Install dependencies for server
COPY package*.json ./
RUN npm install

# Install dependencies for client
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy source code
COPY . .

# Build the React frontend
RUN npm run build

# Set production mode
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
