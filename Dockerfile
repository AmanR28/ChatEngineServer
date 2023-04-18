FROM node:18

RUN apt-get update && apt-get install -y nginx
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 80

CMD ["yarn", "run", "start"]
