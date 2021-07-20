import { CURRENCY_CODE } from '@/constants/currency/currencyFields';
import { MESSAGE_CLASSES } from '@/constants/consoleOutput/outputFields';

export const createTransactionMessages = (unit) => [
  {
    timeout: 2000,
    messageFirstPart: 'API call de-ciphered',
    messageSecondPart: 'successfully',
  },
  {
    message: 'Checking OAuth token...',
  },
  {
    timeout: 3000,
    messageFirstPart: 'OAuth Token checked',
    messageSecondPart: 'successfully',
  },
  {
    message: 'Checking user permissions...',
  },
  {
    timeout: 1000,
    messageFirstPart: 'User permissions checked',
    messageSecondPart: 'successfully',
  },
  {
    message: `Translating into ${CURRENCY_CODE[unit]} native DLT language...`,
  },
  {
    timeout: 2000,
    messageFirstPart: 'Translation done',
    messageSecondPart: 'successfully',
  },
  {
    message: 'Obtaining DLT transaction fee...',
  },
  {
    timeout: 1500,
    messageFirstPart: 'Fee obtained',
    messageSecondPart: 'successfully',
  },
];

export const acceptTransactionMessages = (transactionData) => [
  {
    timeout: 2000,
    messageFirstPart: 'Signing done',
    messageSecondPart: 'successfully',
  },
  {
    message: 'Executing transaction in Overledger...',
  },
  {
    timeout: 2000,
    message: `<pre class="${MESSAGE_CLASSES.neutralMessage}">${JSON.stringify(transactionData, null, 2)}</pre>`,
  },
];

export const transactionDetailsMessages = () => [
  {
    timeout: 1000,
    messageFirstPart: 'Overledger Transaction ID found',
    messageSecondPart: 'successfully',
  },
  {
    message: 'Checking user permissions...',
  },
  {
    timeout: 2000,
    message: 'Access granted',
  },
];

export const transactionFullDetailsMessages = (transactionInformation) => [
  {
    timeout: 2000,
    messageFirstPart: `DLT transaction ID found <span class="${MESSAGE_CLASSES.successMessage}">successfully</span>`,
    messageSecondPart: `<pre class="${MESSAGE_CLASSES.neutralMessage}">${JSON.stringify(transactionInformation, null, 2)}</pre>`,
  },
  // {
  //   message: `Searching ${CURRENCY_CODE[unit]} for transaction...`,
  // },
  // {
  //   timeout: 3000,
  //   messageFirstPart: `${CURRENCY_CODE[unit]} transaction found`,
  //   messageSecondPart: 'successfully',
  // },
];

export const subscribeToTransactionMessages = (transactionId, statusInformation) => [
  {
    timeout: 3000,
    messageFirstPart: 'Tracking set up',
    messageSecondPart: 'successfully',
  },
  {
    message: `Registering subscription for Overledger Transaction ID ${transactionId} to callback URL...`,
  },
  {
    timeout: 2000,
    messageFirstPart: 'Subscription set up',
    messageSecondPart: 'successfully',
  },
  {
    message: 'Sending transaction history...',
  },
  {
    timeout: 3000,
    messageFirstPart: `History sent <span class="${MESSAGE_CLASSES.successMessage}">successfully</span>`,
    messageSecondPart: `<pre class="${MESSAGE_CLASSES.neutralMessage}">${statusInformation}</pre>`,
  },
];
