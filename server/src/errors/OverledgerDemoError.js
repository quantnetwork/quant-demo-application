export default class OverledgerDemoError {
  constructor(code, message) {
    this.service = 'overledger-demo-application-backend';
    this.code = code;
    this.timestamp = Date.now();
    this.message = message;
  }
}
