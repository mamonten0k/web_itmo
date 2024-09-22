FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

COPY config/.env ./

RUN npm install

COPY . .

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "serve"]