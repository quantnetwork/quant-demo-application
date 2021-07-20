/* eslint-disable no-trailing-spaces */
import express from 'express';
import log4js from 'log4js';
import getConfig from '../../config';


log4js.configure({
    appenders: {
        console: { type: 'console' },
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
    },
});


const log = log4js.getLogger('index');

const app = express();


(async () => {
    const config = await getConfig();

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/websocketClientDummy.html');
    });

    app.listen(3001, () => {
        log.info('listening on *:3001');
    });

})();

export default app;
