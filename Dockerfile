FROM mcr.microsoft.com/playwright:noble

WORKDIR /app

# Copy package files for caching
COPY package.json package-lock.json playwright.config.ts ./

# Install dependencies with unsafe-perm
RUN npm ci --unsafe-perm

# Copy rest of project
COPY . .

# Browsers are already included in noble
# RUN npx playwright install --with-deps  <-- remove

# Default command
CMD ["npx", "playwright", "test", "--reporter=html"]
