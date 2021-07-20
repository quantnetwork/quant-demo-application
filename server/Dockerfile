# commented out as we don't have this anymore, it was temporary only, not finished FROM internal-a18996795136811e99af506b35c5cb8f-868004856.eu-west-2.elb.amazonaws.com:5003/quant-node:0.0.1
FROM node:10
LABEL maintainer = "Joao Alves <support@quant.network>"

WORKDIR /app

ADD . .

RUN npm install -g secure-env

RUN secure-env .env -s password

RUN npm install

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start:devnet"]
