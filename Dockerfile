FROM alpine:3.13

RUN apk add ca-certificates

RUN apk add --update --no-cache nodejs npm

WORKDIR /app

COPY package*.json /app

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

RUN npm install

COPY . /app

CMD ["npm", "start"]