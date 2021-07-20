import log4js from 'log4js';

import AuthService from '../services/AuthService';

const log = log4js.getLogger('AuthController');

class AuthController {
  /**
   * Returns an oauth2 token.
   *
   * @param req
   * @param res
   * @param next
   * @returns {Promise<*>}
   */
  static async token(req, res, next) {
    log.info('Received request for access token.');
    try {
      res.object = {
        accessToken: await AuthService.getToken(),
      };
      log.info('Returning access token.');
      return next();
    } catch (e) {
      return next(e);
    }
  }
}

export default AuthController;
