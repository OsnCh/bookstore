FROM node:10-alpine
WORKDIR /src/app
COPY . .
RUN npm install

EXPOSE 3001
CMD ["npm","start"]
