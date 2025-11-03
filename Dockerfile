FROM mcr.microsoft.com/playwright:v1.44.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json playwright.config.ts ./
COPY . .

# Make node_modules and binaries executable by pwuser
RUN chown -R pwuser:pwuser /app && chmod -R +x /app/node_modules/.bin

USER pwuser

CMD ["npx", "playwright", "test"]
