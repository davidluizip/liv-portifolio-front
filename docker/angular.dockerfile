FROM node:16.14.0 as build

WORKDIR /source
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build –prod

FROM nginx:latest
COPY /docker/config/nginx.conf /etc/config/nginx.conf
EXPOSE 80 443
ENTRYPOINT ["nginx"]
# Parametros extras para o entrypoint#
CMD ["-g", "daemon off;"]