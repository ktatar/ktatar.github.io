FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4321

CMD ["sh", "-lc", "rm -f .astro/dev.json && exec npm run dev -- --host 0.0.0.0 --port 4321"]
