// Load the http module to create an http server.
const express = require('express');
const sql = require('mssql');
const fs = require('fs');

const app = express();

let config = {};

fs.readFile('./server/config.json', (readErr, data) => {
  if (readErr) throw readErr;

  config = JSON.parse(data);

  // respond with "hello world" when a GET request is made to the homepage
  app.get('/', (req, res) => {
    res.type('application/json');
    sql.connect(`mssql://${config.db_user}:${config.db_pass}@${config.db_host}/${config.db_name}`)
      .then(() => {
        new sql.Request().query('select * from account')
          .then((recordset) => {
            res.json(recordset);
          }).catch((queryErr) => {
            // ... query error checks
            console.error('Oh noes!', queryErr);
            res.json({ error: 'error', info: queryErr });
          });
      })
      .catch((err) => {
        console.error(err);
      });
  });

  app.listen(config.port, () => {
    console.log(`Listening on ${config.port} baby!`);
  });

  // Put a friendly message on the terminal
  console.log(`Server running at http://127.0.0.1:${config.port}/`);
});

