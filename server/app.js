// Load the http module to create an http server.
const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');

const configurator = require('./configurator');
const accountRouter = require('./routers/accounts');

let configured;

configurator()
  .then((c) => {
    configured = c;

    const app = express();
    app.use(express.static('client'));
    app.use(bodyParser.json());
    app.use(accountRouter);

    app.get('/posts', (req, res) => {
      res.type('application/json');
      sql.connect(c.sqlConfig)
          .then(() => {
            new sql.Request().query('select * from post')
              .then((recordset) => {
                res.json(recordset);
              }).catch((queryErr) => {
                // ... query error checks
                console.error('Oh noes!', queryErr);
                res.json({ error: 'error', info: queryErr });
              });
          })
          .catch((err) => {
            res.json({ error: 'sql error', info: err });
            console.error(err);
          });
    });

    app.listen(c.appConfig.port, () => {
      console.log(`Listening on ${c.appConfig.port}.`);
    });
  });

// app.get('/account/:accId', (req, res) => {

// });


