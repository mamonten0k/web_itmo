FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY config/.env ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl gnupg wget \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/trusted.gpg.d/google.gpg \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r chromeuser && useradd -m -r -g chromeuser chromeuser
RUN mkdir -p /home/chromeuser/.cache/chrome && \
    chown -R chromeuser:chromeuser /home/chromeuser

RUN echo 'kernel.unprivileged_userns_clone=1' > /etc/sysctl.d/00-local-userns.conf

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/config/.env ./

RUN chown -R chromeuser:chromeuser /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV NODE_ENV production

USER chromeuser

EXPOSE 3000

CMD ["npm", "run", "serve"]
