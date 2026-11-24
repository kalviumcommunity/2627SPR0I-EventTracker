FROM node:22-alpine@sha256:1314fb30ec37592d5845e5a160d522c0e680972aa534549940b8d73bde88481a

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY index.js ./
COPY config/ ./config/
COPY routes/ ./routes/
COPY utils/ ./utils/

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
