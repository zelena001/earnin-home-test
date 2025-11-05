FROM mcr.microsoft.com/playwright:v1.56.1-noble

WORKDIR /app

# Copy package files first for caching
COPY package.json package-lock.json playwright.config.ts ./ 
RUN npm ci --unsafe-perm

# Copy the rest of the project
COPY . .

# Ensure folders are writable
RUN mkdir -p /app/playwright-report
RUN chown -R pwuser:pwuser /app

# Use default Playwright user
USER pwuser

# Default command: run tests and generate HTML report
CMD ["npx", "playwright", "test", "--reporter=html"]
