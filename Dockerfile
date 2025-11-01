# 1️⃣ Use Playwright official image with browsers and dependencies
FROM mcr.microsoft.com/playwright:v1.44.0-focal

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json first for caching
COPY package*.json ./

# 4️⃣ Install npm dependencies
RUN npm ci

# 5️⃣ Copy the rest of your project
COPY tsconfig.json playwright.config.ts ./
COPY . .

# 6️⃣ Optional: install Playwright browsers (already included in this image)
# RUN npx playwright install --with-deps   <-- NOT needed

# 7️⃣ Default command to run tests
CMD ["npx", "playwright", "test"]
