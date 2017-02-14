// Load the http module to create an http server.
const express = require('express');
const sql = require('mssql');
const fs = require('fs');

const app = express();

let config = {};

fs.readFile('./server/config.json', (readErr, data) => {
  if (readErr) throw readErr;

  config = JSON.parse(data);

  const sqlConfig = {
    user: config.db_user,
    password: config.db_pass,
    server: config.db_host, // You can use 'localhost\\instance' to connect to named instance
    instanceName: config.db_inst,
    database: config.db_name,
    dialect: 'mssql',
    dialectOptions: {
      instanceName: config.db_inst,
    },
    options: {
      truestedConnection: true,
      database: config.db_name,
      instancename: config.db_inst,
    },
  };

  // respond with "hello world" when a GET request is made to the homepage
  app.get('/', (req, res) => {
    res.type('application/json');
    sql.connect(sqlConfig)
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
        res.json({ error: 'sql error', info: err });
        console.error(err);
      });
  });

  app.get('/accounts', (req, res) => {
    res.type('application/json');
    sql.connect(sqlConfig)
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
        res.json({ error: 'sql error', info: err });
        console.error(err);
      });
  });

  app.get('/account/:accId', (req, res) => {
    res.type('application/json');
    sql.connect(sqlConfig)
      .then(() => {
        new sql.Request().query(`select * from account where accId=${req.params.accId}`)
          .then((recordset) => {
            console.dir(recordset);
            res.json(recordset[0]);
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
  })

  app.get('/posts', (req, res) => {
    res.type('application/json');
    sql.connect(sqlConfig)
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

  app.listen(config.port, () => {
    console.log(`Listening on ${config.port} baby!`);
  });

  // Put a friendly message on the terminal
  console.log(`Server running at http://127.0.0.1:${config.port}/`);
});

