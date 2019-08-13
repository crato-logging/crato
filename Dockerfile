#Specify base image
FROM node:alpine

#Install app
WORKDIR /usr/app

COPY ./package.json ./
RUN npm install
COPY ./ ./

#Run commands
CMD ["npm", "start"]