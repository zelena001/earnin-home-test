# Use the official Playwright image with browsers preinstalled
FROM mcr.microsoft.com/playwright:v1.44.0-focal

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your code
COPY tsconfig.json playwright.config.ts ./
COPY . .

# Switch to Playwright's default user to avoid permission issues
USER pwuser

# Run tests
CMD ["npx", "playwright", "test"]
