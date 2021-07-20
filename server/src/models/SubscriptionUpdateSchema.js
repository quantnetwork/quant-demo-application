const Joi = require('joi');

const status = Joi.object({
    value: Joi.string(),
    code: Joi.string(),
    description: Joi.string(),
    message: Joi.string(),
    timestamp: Joi.string(),
})

const subscriptionDetails = Joi.object({
    ids: Joi.array(),
    status: status,
});

const addressUpdateDetails = Joi.object({
    addressId: Joi.string(),
    transactionId: Joi.string()
})

const webHookSmartContractEventUpdateDetails = Joi.object({
    smartContractId: Joi.string(),
    eventId: Joi.string(),
    eventName: Joi.string(),
    eventParameters: Joi.string(),
    timestamp: Joi.date(),
    transactionId: Joi.string()
})

const addressSubscribeProcessorMessage = Joi.object({
    callbackUrl: Joi.string(),
    id: Joi.string(),
    transactionHash: Joi.string(),
    from: Joi.string(),
    to: Joi.string(),
    status: Joi.string(),
    blockNumber: Joi.number(),
    amount: Joi.number(),
    data: Joi.string()
})

const overledgerTransactionUpdateDetails = Joi.object({
    timestamp: Joi.date(),
    overledgerTransactionId: Joi.string(),
    requestId: Joi.string(),
    transactionId: Joi.string(),
    status: status,
});

const subscriptionUpdateSchema = Joi.object({
    subscriptionId: Joi.string()
        .required(),
    type: Joi.string()
        .required(),
    callbackUrl: Joi.string()
        .required(),
    subscriptionDetails: subscriptionDetails
        .required(),
    overledgerTransactionUpdateDetails: overledgerTransactionUpdateDetails
        .required(),
    addressUpdateDetails: addressUpdateDetails,
    smartContractEventUpdateDetails: webHookSmartContractEventUpdateDetails,
    addressSubscribeProcessorMessage: addressSubscribeProcessorMessage,
});

export default subscriptionUpdateSchema;
