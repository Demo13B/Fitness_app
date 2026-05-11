FROM node:25-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:25-alpine AS runner

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production=true

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD [ "node", "dist/main.js" ]
