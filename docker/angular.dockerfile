 FROM node as build
 COPY package.json package-lock.json ./
 ## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm install -g npm@9.1.3
 RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
 WORKDIR /ng-app
 COPY . .

FROM nginx:alpine
COPY –from=build /source/dist/liv-portfolio /usr/share/nginx/html
COPY –from=build /source/docker/config/nginx.conf /etc/nginx/conf.d/
EXPOSE 80