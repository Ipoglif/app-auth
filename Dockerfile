FROM node:14-alpine

ENV NODE_ENV=prod
CMD ["node", "app.js"]

COPY package.json .
RUN npm install
COPY . .