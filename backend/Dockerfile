FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 8000

CMD ["npx", "tsx", "src/index.ts"]