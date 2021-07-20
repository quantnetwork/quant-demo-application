const Joi = require('joi');

const gatewayFeeSchema = Joi.object({
  amount: Joi.number()
    .required(),
  unit: Joi.string()
    .required()
    .valid('QNT'),
});

const dltFeeSchema = Joi.object({
  amount: Joi.number()
    .required(),
  unit: Joi.string()
    .required()
    .valid('BTC', 'ETH', 'XRP'),
});

const preparedTransactionSchema = Joi.object({
  requestId: Joi.string()
    .guid()
    .required(),
  gatewayFee: gatewayFeeSchema
    .required(),
  dltFee: dltFeeSchema
    .required(),
  nativeData: Joi.any()
    .required(),
});

export default preparedTransactionSchema;
