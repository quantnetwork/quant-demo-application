import request from 'supertest';

const transactionUpdate = require('./resources/transaction-update.json');
const invalidUpdate = require('./resources/invalid-request.json');

const app = require('../src').default;

describe('Subscription tests', () => {
    test('Should do an update when receiving a transaction update', async () => {
        const result = await request(app).post('/subscription-update').send(transactionUpdate);

        expect(result.status).toEqual(200);
    });

    test('Should get an error if we send an invalid request', async () => {
        const result = await request(app).post('/subscription-update').send(invalidUpdate);

        expect(result.status).toEqual(400);
    });
});
