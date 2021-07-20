/* eslint-disable no-trailing-spaces */
import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import process from 'process';
import log4js from 'log4js';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import HttpStatus from 'http-status';
import DefaultController from './controllers/DefaultController';
import swaggerDocument from './swagger.json';
import ErrorDictionary from './errors/ErrorDictionary';
import SignController from './controllers/SignController';
import OverledgerDemoError from './errors/OverledgerDemoError';
import SubscriptionController from './controllers/SubscriptionController';
import AuthController from './controllers/AuthController';

import getConfig from '../config';

log4js.configure({
  appenders: {
    console: { type: 'console' },
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
  },
});

const log = log4js.getLogger('index');

const app = express();
app.use(cors());
const server = http.createServer(app);

// Socket.io aka the websocket handler
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});
io.on('connection', (socket) => {
  log.debug('New connection to websocket');
  socket.on('disconnect', () => {
    log.debug('Connection terminated');
  });
});

(async () => {
  const config = await getConfig();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: '50mb' }));

  if (config.enable_swagger || process.env.NODE_ENV !== 'production') {
    log.info('Swagger docs up and running...');
    app.use('/swagger-ui.html', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  app.use((req, res, next) => {
    // adding config to req
    req.config = config;
    // adding websocket to req in case endpoint needs to emmit something.
    req.ws = io;
    return next();
  });

  app.get('/status', DefaultController.status);

  app.post('/sign', SignController.validateSignRequest, SignController.sign);

  app.get('/origin/:technology', SignController.getOriginIdForTechnology);

  app.post('/subscription-update', SubscriptionController.validateSubscriptionUpdateRequest, SubscriptionController.transactionUpdate);

  app.get('/token', AuthController.token);

  app.use((err, req, res, next) => {
    let error = err;
    log.error(error.type);

    if (error === undefined) {
      log.info('Undefined error');
      error = new OverledgerDemoError(HttpStatus.INTERNAL_SERVER_ERROR, ErrorDictionary.INTERNAL_SERVER_ERROR.description.concat(req.url));
    }

    log.info(error);
    if (error.code === undefined) {
      error.code = HttpStatus.NOT_FOUND;
    }
    log.info(error.code);
    res.status(error.code).send(error);
  });

  app.use((req, res, next) => {
    if (res.object) {
      return res.status(HttpStatus.OK).json(res.object);
    }

    return res.status(HttpStatus.NOT_FOUND).send(
      new OverledgerDemoError(HttpStatus.NOT_FOUND, ErrorDictionary.NOT_FOUND.description.concat(req.url)),
    );
  });

  if (process.env.NODE_ENV !== 'test') {
    server.listen(config.server.port, () => {
      log.info(`Overledger demo backend listening on port ${config.server.port}!`);
    });
  }
})();

export default app;
