FROM mcr.microsoft.com/playwright:noble

WORKDIR /app

COPY package.json package-lock.json playwright.config.ts ./

RUN npm ci --unsafe-perm

COPY --chown=pwuser:pwuser . .

USER pwuser

CMD ["npx", "playwright", "test", "--reporter=html"]
