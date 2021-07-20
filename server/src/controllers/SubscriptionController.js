import log4js from 'log4js';
import HttpStatus from 'http-status';
import OverledgerDemoError from '../errors/OverledgerDemoError';
import subscriptionUpdateSchema from '../models/SubscriptionUpdateSchema';

const log = log4js.getLogger('SubscriptionController');

class SubscriptionController {
  /**
     * Notifies via a websocket, about transaction updates.
     *
     * @param {Request} req
     * @param {Response} res
     * @param {Next} next
     */
  static async transactionUpdate(req, res, next) {
    // Empty body request, likely its webhook validating the callback url.
    if (!Object.keys(req.body).length) {
      log.info('Received empty body request. skipping');
      res.object = { update: 'Nothing to do' };
      return next();
    }

    log.info(`Received update ${req.body}`);
    try {
      log.info('Sending update to client via websocket');
      req.ws.emit('transactionUpdate', req.body);
      res.object = { update: 'success' };
      return next();
    } catch (e) {
      return next(e);
    }
  }

  static async validateSubscriptionUpdateRequest(req, res, next) {
    // Empty body request, likely its webhook validating the callback url.
    if (!Object.keys(req.body).length) {
      next();
    }
    const result = subscriptionUpdateSchema.validate(req.body);
    if (result.error == null) {
      next();
    } else {
      const error = new OverledgerDemoError(HttpStatus.BAD_REQUEST, result.error);
      next(error);
    }
  }
}

export default SubscriptionController;
