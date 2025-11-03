FROM mcr.microsoft.com/playwright:v1.56.1-noble

WORKDIR /app

COPY package.json package-lock.json playwright.config.ts ./

RUN npm ci --unsafe-perm

COPY --chown=pwuser:pwuser . .

USER pwuser

CMD ["playwright", "test", "--reporter=html"]
