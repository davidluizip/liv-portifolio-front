FROM node as build
WORKDIR /usr/app/
COPY package.json ./
## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm install -g npm@9.1.3
RUN npm run build --prod

FROM nginx:latest
COPY /nginx/config/nginx.conf /etc/config/nginx.conf
EXPOSE 80 443
ENTRYPOINT ["nginx"]
# Parametros extras para o entrypoint#
CMD ["-g", "daemon off;"]