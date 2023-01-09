FROM node:latest as build
WORKDIR /app
COPY package.json /app
RUN npm install --silent
COPY . .
RUN npm run build

FROM nginx:latest
RUN rm -rf /usr/share/nginx/html/*
COPY /nginx/config/nginx.conf /etc/nginx/conf.d/
COPY --from=build /app/dist/liv-portfolio /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]