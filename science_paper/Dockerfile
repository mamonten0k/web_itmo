FROM node:20

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl gnupg wget \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/trusted.gpg.d/google.gpg \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m chromeuser

RUN chown -R chromeuser:chromeuser /usr/src/app

COPY package*.json ./

COPY config/.env ./

RUN npm install

COPY . .

ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN npm run build

USER chromeuser

EXPOSE 3000

CMD ["npm", "run", "serve"]