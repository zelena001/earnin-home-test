FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Fix permission for Playwright binary
RUN chmod +x $(npm root)/.bin/playwright || true

COPY tsconfig.json playwright.config.ts ./
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test"]
