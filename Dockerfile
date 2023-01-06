FROM node as build
WORKDIR /usr/ng-app/
COPY package.json ./
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
RUN npm install -g npm@9.1.3 @angular/cli
RUN npm run build --prod

FROM nginx:latest
COPY /nginx/config/nginx.conf /etc/config/nginx.conf
EXPOSE 80 443
ENTRYPOINT ["nginx"]
# Parametros extras para o entrypoint#
CMD ["-g", "daemon off;"]