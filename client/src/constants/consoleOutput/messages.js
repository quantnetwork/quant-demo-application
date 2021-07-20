import { CURRENCY_CODE } from '@/constants/currency/currencyFields';
import { MESSAGE_CLASSES } from '@/constants/consoleOutput/outputFields';
import { wrapTextInSpan, wrapObjectInPre } from '@/helpers/helper';

export const createTransactionMessages = {
  firstMessages: () => ([
    {
      message: 'De-ciphering signed API call...',
    },
  ]),
  secondMessages: (unit) => ([
    {
      timeout: 2000,
      message: `API call de-ciphered ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')}`,
    },
    {
      message: 'Checking OAuth token...',
    },
    {
      timeout: 3000,
      message: `OAuth Token checked ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')}`,
    },
    {
      message: 'Checking user permissions...',
    },
    {
      timeout: 1000,
      message: `User permissions checked ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')}`,
    },
    {
      message: `Translating into ${CURRENCY_CODE[unit]} native DLT language...`,
    },
    {
      timeout: 2000,
      message: `Translation done ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')}`,
    },
    {
      message: 'Obtaining DLT transaction fee...',
    },
    {
      timeout: 1500,
      message: `Fee obtained ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')}`,
    },
  ]),
};

export const acceptTransactionMessages = {
  firstMessages: () => ([
    {
      message: 'Signing native DLT payload...',
    },
  ]),
  secondMessages: (transactionData) => ([
    {
      timeout: 2000,
      message: `Signing done ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')}`,
    },
    {
      message: 'Executing transaction in Overledger...',
    },
    {
      timeout: 2000,
      message: wrapObjectInPre(MESSAGE_CLASSES.neutralMessage, transactionData),
    },
  ]),
};

export const transactionDetailsMessages = {
  firstMessages: () => ([
    {
      message: 'Searching Overledger for transaction...',
    },
  ]),
  secondMessages: () => ([
    {
      timeout: 1000,
      message: `Overledger Transaction ID found ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')}`,
    },
    {
      message: 'Checking user permissions...',
    },
    {
      timeout: 2000,
      message: 'Access granted',
    },
  ]),
};

export const transactionFullDetailsMessages = {
  firstMessages: () => ([
    {
      message: 'Searching Overledger for corresponding DLT Transaction ID...',
    },
  ]),
  secondMessages: (transactionInformation) => ([
    {
      timeout: 2000,
      message: `DLT transaction ID found ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')} ${wrapObjectInPre(MESSAGE_CLASSES.neutralMessage, transactionInformation)}`,
    },
  ]),
};

export const subscribeToTransactionMessages = {
  firstMessages: (technology) => ([
    {
      message: `Sending tracking request to ${technology} Node...`,
    },
  ]),
  secondMessages: (transactionId, statusInformation) => ([
    {
      timeout: 3000,
      message: `Tracking set up ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')}`,
    },
    {
      message: `Registering subscription for Overledger Transaction ID ${transactionId} to callback URL...`,
    },
    {
      timeout: 2000,
      message: `Subscription set up ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')}`,
    },
    {
      message: 'Sending transaction history...',
    },
    {
      timeout: 3000,
      message: `History sent ${wrapTextInSpan(MESSAGE_CLASSES.successMessage, 'successfully')} ${wrapObjectInPre(MESSAGE_CLASSES.neutralMessage, statusInformation)}`,
    },
  ]),
};
