FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
<<<<<<< HEAD
=======
RUN apk add --no-cache postgresql-client
>>>>>>> 2058b16264571558f9262dcda0c627b5e99995cf

COPY . .

RUN npx prisma generate

EXPOSE 3000

<<<<<<< HEAD
CMD ["npm", "run", "dev"]
=======
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "run", "start"]
>>>>>>> 2058b16264571558f9262dcda0c627b5e99995cf
