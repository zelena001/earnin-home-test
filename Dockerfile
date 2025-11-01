# Use Node.js official image
FROM node:20

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json first
# This allows Docker to cache npm install step
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy your tsconfig and source code
COPY tsconfig.json ./
COPY playwright.config.ts ./
COPY . .

# Optional: install Playwright browsers
RUN npx playwright install --with-deps

# Default command: run tests
CMD ["npx", "playwright", "test"]
