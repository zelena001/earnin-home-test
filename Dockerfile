FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy code
COPY tsconfig.json playwright.config.ts ./
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

# Default command to run tests
CMD ["npx", "playwright", "test"]
