FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y software-properties-common

RUN apt-get install -y nginx

RUN mkdir /App

COPY . /App

COPY nginx.conf /etc/nginx/sites-enabled/default

ENTRYPOINT nginx -g "daemon off;"

