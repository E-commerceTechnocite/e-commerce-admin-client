FROM nginx:1.21-alpine

COPY ./dist /var/www/html
COPY ./nginx.conf /etc/nginx/nginx.conf