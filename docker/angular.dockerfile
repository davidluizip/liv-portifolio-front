FROM node as build
WORKDIR /usr/app/
COPY package.json package-lock.json ./
## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm install -g npm@9.1.3
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
ENV PATH /usr/app/node_modules/.bin:$PATH

FROM nginx:latest
COPY /docker/config/nginx.conf /etc/config/nginx.conf
EXPOSE 80 443
ENTRYPOINT ["nginx"]
# Parametros extras para o entrypoint#
CMD ["-g", "daemon off;"]