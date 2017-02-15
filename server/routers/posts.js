const sql = require('mssql');
const express = require('express');
const configurator = require('../configurator');

const postRouter = express.Router();

configurator().then((configuration) => {
  postRouter.get('/posts', (req, res) => {
    res.type('application/json');
    sql.connect(configuration.sqlConfig)
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
});

module.exports = postRouter;
