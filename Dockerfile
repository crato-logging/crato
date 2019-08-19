#Specify base image
FROM node:alpine

#Install app
WORKDIR /usr/crato-consumer

COPY ./package.json ./
RUN npm install
COPY ./ ./

#Run commands
CMD ["npm", "start"]