FROM node:latest as build
WORKDIR /app
COPY package.json /app
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:latest
COPY /nginx/config/nginx.conf /etc/config/nginx.conf
EXPOSE 80 443
ENTRYPOINT ["nginx"]
# Parametros extras para o entrypoint#
CMD ["-g", "daemon off;"]