FROM node:20-slim

RUN mkdir -p /opt/app 
WORKDIR /opt/app 

COPY package.json package-lock.json . 

RUN npm install 

COPY dist/src/ . 

EXPOSE 3000 

CMD [ "node", "app.js"]