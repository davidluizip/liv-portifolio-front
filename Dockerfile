FROM node:latest as build
WORKDIR /app
COPY package.json /app
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:latest
COPY /nginx/config/nginx.conf /etc/config/nginx.conf
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*