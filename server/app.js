// Load the http module to create an http server.
const express = require('express');
const bodyParser = require('body-parser');

const configurator = require('./configurator');
const accountRouter = require('./routers/accounts');
const postRouter = require('./routers/posts');

configurator().then((c) => {
  // get a pointer to the express app.
  const app = express();

  // serve static files
  app.use(express.static('client'));

  // for non-static files, parse incoming json data
  app.use(bodyParser.json());

  // then run everything through the various routers.
  app.use(accountRouter);
  app.use(postRouter);

  // and listen on the configured port.
  app.listen(c.appConfig.port, () => {
    console.log(`Listening on ${c.appConfig.port}.`);
  });
});
