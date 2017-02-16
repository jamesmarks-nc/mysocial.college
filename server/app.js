// Load the express module to manage our http server.
const express = require('express');
const bodyParser = require('body-parser');

// Turns out that in recent versions of Node, you can
// simply require JSON files directly into your code.
// Thank god. The configurator format was UUUUUUUUgly!
const config = require('./config.json');

// Load up routers.
const loginRouter = require('./routers/login');
const accountRouter = require('./routers/accounts');
const postRouter = require('./routers/posts');

// create and get a pointer to the express app.
const app = express();

// parse incoming json data
app.use(bodyParser.json());

// then run everything through the various routers.
app.use('/login', loginRouter);
app.use(accountRouter);
app.use(postRouter);

// serve static files
app.use(express.static('client'));

// and finally, listen on the configured port.
app.listen(config.app.port, () => {
  console.log(`Listening on ${config.app.port}.`);
});
