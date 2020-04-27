FROM ubuntu:18.04

RUN apt update
RUN apt install curl -y
RUN apt install sudo -y
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN apt install nodejs  -y
##RUN apt instal
RUN mkdir /App

COPY . /App

WORKDIR /App

EXPOSE 9132
CMD ["nohup", "npm", "start", "server.js"] 
