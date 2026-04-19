FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]