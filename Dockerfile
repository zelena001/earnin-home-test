FROM mcr.microsoft.com/playwright:noble

WORKDIR /app

# Copy package files for caching
COPY package.json package-lock.json playwright.config.ts ./

# Install dependencies with unsafe-perm
RUN npm ci --unsafe-perm

# Copy rest of project
COPY . .

# Default user in noble is pwuser, override to root
USER root

CMD ["npx", "playwright", "test", "--reporter=html"]
