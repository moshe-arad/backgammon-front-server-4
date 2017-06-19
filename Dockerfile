FROM node:alpine
RUN apk update && apk upgrade
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
CMD [ "npm", "start"]
CMD ["node", "app.js"]
