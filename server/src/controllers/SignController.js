import log4js from 'log4js';
import OverledgerSDK from '@quantnetwork/overledger-bundle';
import { DltNameOptions } from '@quantnetwork/overledger-types';
import HttpStatus from 'http-status';
import DltFeeOptions from '../models/DltFeeOptions';
import preparedTransactionSchema from '../models/SignRequestSchema';
import OverledgerDemoError from '../errors/OverledgerDemoError';

const log = log4js.getLogger('SignController');

class SignController {
  /**
   * signs a transaction prepared by overledger
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Next} next
   */
  static async sign(req, res, next) {
    // We need to get the appropriate options for the dlt this request is aimed at.
    try {
      const dltOptions = SignController.pickDlt(req);
      const overledger = new OverledgerSDK({
        dlts: [{ dlt: dltOptions.dltName }],
        provider: { network: req.config.network },
        envFilePassword: req.config.envFilePassword,
      });
      // Setting our private key from the encrypted .env file
      overledger.dlts[dltOptions.dltName].setAccount({ privateKey: dltOptions.privateKey });

      log.info('Signing prepared transaction');
      const preparedTransaction = req.body;
      const { signedTransaction } = await overledger.sign(dltOptions.dltName, preparedTransaction);

      res.object = {
        requestId: preparedTransaction.requestId,
        signed: signedTransaction,
      };
      log.info('Prepared transaction signed');
      return next();
    } catch (e) {
      return next(e);
    }
  }

  static async getOriginIdForTechnology(req, res, next) {
    let originId;
    if (req.params.technology === 'Ethereum') {
      originId = process.env.PARTY_A_ETHEREUM_ORIGIN_ID;
    } else if (req.params.technology === 'XRP Ledger') {
      originId = process.env.PARTY_A_XRP_LEDGER_ORIGIN_ID;
    } else {
      const message = 'Technology not supported.';
      log.error(message);
      const error = new OverledgerDemoError(HttpStatus.BAD_REQUEST, message);
      return next(error);
    }
    res.object = {
      originId,
    };
    return next();
  }

  static async validateSignRequest(req, res, next) {
    const result = preparedTransactionSchema.validate(req.body);
    if (result.error == null) {
      return next();
    } else {
      const error = new OverledgerDemoError(HttpStatus.BAD_REQUEST, result.error);
      return next(error);
    }
  }

  static pickDlt(req) {
    // Lets pick the right dlt based on the fee type
    switch (req.body.dltFee.unit) {
      case DltFeeOptions.ETHEREUM:
        return {
          dltName: DltNameOptions.ETHEREUM,
          privateKey: req.config.privateKeys.ethereum,
        };
      case DltFeeOptions.BITCOIN:
        return {
          dltName: DltNameOptions.BITCOIN,
          privateKey: req.config.privateKeys.bitcoin,
        };
      case DltFeeOptions.XRP_LEDGER:
        return {
          dltName: DltNameOptions.XRP_LEDGER,
          privateKey: req.config.privateKeys.xrp,
        };
      default:
        throw new OverledgerDemoError(HttpStatus.BAD_REQUEST, 'Technology not supported');
    }
  }
}

export default SignController;
