
const ErrorDictionary = {
  OLD_BLOCK_NOT_FOUND: { value: 10, description: 'Block was not found, the oldest block in this node is: ' },
  BLOCK_NOT_FOUND: { value: 20, description: 'The block was not found: ' },
  INVALID_BLOCK_HASH: { value: 30, description: 'Invalid block hash: ' },
  BLOCK_RANGE_NOT_FOUND: { value: 40, description: 'Block range not found: ' },
  INVALID_ADDRESS: { value: 50, description: 'Invalid address: ' },
  ADDRESS_NOT_FOUND: { value: 60, description: 'Address not found: ' },
  INVALID_CURRENCY: { value: 70, description: 'Invalid currency: ' },
  SIGNED_TRANSACTION_MISSING: { value: 80, description: 'Signed transaction missing for request: ' },
  SIGNED_TRANSACTION_MUST_CONTAIN_LIST: { value: 90, description: 'Signed transaction must contain a list of transactions: ' },
  SIGNED_TRANSACTION_MISSING_MANDATORY_ELEMENT: { value: 100, description: 'Signed transaction missing mandatory transactions[0] element: ' },
  MORE_THAN_ONE_TRANSACTION_IN_REQUEST: { value: 110, description: 'The XRP Connector supports only a single transaction per request: ' },
  INVALID_TRANSACTION: { value: 120, description: 'Invalid transaction object: ' },
  ERROR_OCCURRED: { value: 130, description: 'An error occured: ' },
  INVALID_HASH_RECEIVED: { value: 140, description: 'Invalid hash received: ' },
  TRANSACTION_NOT_FOUND: { value: 150, description: 'Transaction not found: ' },
  RIPPLE_NODE_NOT_AVAILABLE: { value: 160, description: 'Could not connect to the XRP Ledger node.' },
  INVALID_REQUEST_BODY: { value: 170, description: 'The request body is not valid: ' },
  INTERNAL_SERVER_ERROR: { value: 180, description: 'Internal server error: ' },
  NOT_FOUND: { value: 190, description: 'Sorry, we cannot find that: ' },
  BLOCK_NUMBER_NOT_VALID: { value: 200, description: 'Block number must be a positive integer: ' }
}
Object.freeze(ErrorDictionary);

export default ErrorDictionary;
