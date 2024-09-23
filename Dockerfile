FROM node:18-alpine

WORKDIR /src/app

COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "dev"]
