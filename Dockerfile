# Dockerfile
FROM mcr.microsoft.com/playwright:noble

WORKDIR /app

# Copy package files
COPY package.json package-lock.json playwright.config.ts ./

# Install dependencies as pwuser
RUN npm ci --unsafe-perm

# Copy rest of project
COPY --chown=pwuser:pwuser . .

# Default user is pwuser
# Run playwright directly, no npx
CMD ["playwright", "test", "--reporter=html"]
