FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN apk add --no-cache postgresql-client

COPY . .

RUN npx prisma generate

EXPOSE 3000

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "run", "start"]
