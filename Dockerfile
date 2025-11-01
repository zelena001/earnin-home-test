FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json playwright.config.ts ./
COPY . .

# Do NOT install browsers here
# We'll install them at runtime in CI

CMD ["sh", "-c", "npx playwright install --with-deps && npx playwright test"]
