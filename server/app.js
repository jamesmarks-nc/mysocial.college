// Load the express module to manage our http server.
import express from 'express';
import bodyParser from 'body-parser';

// Load up routers.
import * as routers from './routers';

// create and get a pointer to the express app.
const app = express();

// Load in configuration
import config from './config.json';
app.locals.config = config;

// parse incoming json data
app.use(bodyParser.json());

// then run everything through the various routers.
app.use('/login', routers.loginRouter);
app.use(routers.accountRouter);
app.use(routers.postRouter);

// serve static files
app.use(express.static('client'));

// and finally, listen on the configured port.
app.listen(config.app.port, () => {
  console.log(`Listening on ${config.app.port}.`);
});
