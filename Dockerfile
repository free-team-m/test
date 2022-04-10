FROM node:current-alpine3.14

WORKDIR /usr/src/app

COPY package*.json ./
EXPOSE 3000

RUN npm install

COPY . .

CMD [ "node", "bin/www" ]