FROM node:18-slim

WORKDIR /app

COPY package*.json /app/

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

RUN npm install

COPY . /app/

CMD ["npm", "start"]