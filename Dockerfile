


FROM mcr.microsoft.com/playwright:v1.44.0-focal
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json playwright.config.ts ./
COPY . .
USER pwuser
CMD ["npx", "playwright", "test"]
