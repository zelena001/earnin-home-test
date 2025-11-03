FROM mcr.microsoft.com/playwright:v1.56.1-noble

WORKDIR /app

COPY package.json package-lock.json playwright.config.ts ./

RUN npm ci --unsafe-perm

COPY --chown=pwuser:pwuser . .


# Default user in noble is pwuser, override to root
USER root

CMD ["npx","playwright", "test", "--reporter=html"]
