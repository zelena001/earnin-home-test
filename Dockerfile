# Use Playwright image with Node and browsers (noble = Ubuntu 24.04)
FROM mcr.microsoft.com/playwright:noble

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package.json package-lock.json ./

# Install Node dependencies
RUN npm ci

# Copy the rest of your project
COPY . .

# Install Playwright browsers (already included, but safe)
RUN npx playwright install --with-deps

# Default command to run tests
CMD ["npx", "playwright", "test", "--reporter=html"]
