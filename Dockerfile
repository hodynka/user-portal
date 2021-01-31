FROM node:15-alpine

WORKDIR /usr/src/app

COPY bin ./bin
COPY public ./public
COPY routes ./routes
COPY index.js ./index.js
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY node_modules ./node_modules

EXPOSE 3000

CMD [ "npm", "run", "start" ]