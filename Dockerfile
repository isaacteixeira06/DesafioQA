FROM cypress/browsers:latest

WORKDIR /app

COPY package.json tsconfig.json ./

RUN npm install

COPY . .

CMD ["npx", "cypress", "run"]