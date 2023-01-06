FROM node:16.14.0 as build

WORKDIR /source
COPY package.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY –from=build /source/dist/liv-portfolio /usr/share/nginx/html
COPY –from=build /source/docker/config/nginx.conf /etc/nginx/conf.d/
EXPOSE 8080