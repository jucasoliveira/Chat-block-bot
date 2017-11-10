FROM node:boron

RUN mkdir docker-node-mongo
RUN cd docker-node-mongo


RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "start"]