import request from 'supertest';

const xrpRequest = require('./resources/xrp-ledger-prepared-transaction.json');
const btcRequest = require('./resources/bitcoin-prepared-transaction.json');
const ethRequest = require('./resources/ethereum-prepared-transaction.json');
const bogusRequest = require('./resources/bogus-prepared-transaction.json');
const invalidRequest = require('./resources/invalid-request.json');


const app = require('../src').default;

describe('Sign tests', () => {
  test('Should be able to sign an Ethereum prepared request', async () => {
    const result = await request(app).post('/sign').send(ethRequest);

    expect(result.status).toEqual(200);
    expect(typeof result.body.requestId).toBe('string');
    expect(typeof result.body.signed).toBe('string');
  });

  test('Should be able to sign a Bitcoin prepared request', async () => {
    const result = await request(app).post('/sign').send(btcRequest);

    expect(result.status).toEqual(200);
    expect(typeof result.body.requestId).toBe('string');
    expect(typeof result.body.signed).toBe('string');
  });

  test('Should be able to sign a Xrp prepared request', async () => {
    const result = await request(app).post('/sign').send(xrpRequest);

    expect(result.status).toEqual(200);
    expect(typeof result.body.requestId).toBe('string');
    expect(typeof result.body.signed).toBe('string');
  });

  test('Should get an error if we send a non supported type', async () => {
    const result = await request(app).post('/sign').send(bogusRequest);

    expect(result.status).toEqual(400);
  });

  test('Should get an error if we send an invalid request', async () => {
    const result = await request(app).post('/sign').send();

    expect(result.status).toEqual(400);
  });

  test('Should be able to retrieve Ethereum origin id', async () => {
    const result = await request(app).get('/origin/Ethereum').send();

    expect(result.status).toEqual(200);
    expect(result.body.originId).toBe(process.env.PARTY_A_ETHEREUM_ORIGIN_ID);
  });

  test('Should be able to retrieve XRP Ledger origin id', async () => {
    const result = await request(app).get('/origin/XRP Ledger').send();

    expect(result.status).toEqual(200);
    expect(result.body.originId).toBe(process.env.PARTY_A_XRP_LEDGER_ORIGIN_ID);
  });

  test('Should get an error if we send an invalid technology', async () => {
    const result = await request(app).get('/origin/Bitcoin').send();

    expect(result.status).toEqual(400);
  });
});
