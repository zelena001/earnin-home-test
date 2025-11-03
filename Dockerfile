FROM mcr.microsoft.com/playwright:v1.56.1-noble

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json playwright.config.ts ./ 
RUN npm ci --unsafe-perm

# Copy the rest of the project
COPY . .

RUN chmod -R a+x /app/node_modules/.bin

# Ensure test-results folder is writable
RUN mkdir -p /app/test-results && chmod -R a+rwx /app/test-results

# Use default Playwright user
USER pwuser

# Just run tests — no report folders
CMD ["npx", "playwright", "test"]
