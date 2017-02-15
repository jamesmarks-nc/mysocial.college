const sql = require('mssql');
const express = require('express');
const configurator = require('../configurator');

const accountRouter = express.Router();

configurator().then((configuration) => {
  accountRouter.get('/accounts', (req, res) => {
    res.type('application/json');
    sql.connect(configuration.sqlConfig)
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

  accountRouter.route('/account')
    .post((req, res) => {
      sql.connect(configuration.sqlConfig)
        .then(() => {
          const { accFirstName, accLastName, accEmail, accPassword,
                  accSchool, accYear, accStudy, accBudget } = req.body;

          new sql.Request().query(`INSERT INTO account (accFirstName, accLastName, accEmail, accPassword, accSchool, accYear, accStudy, accBudget)
                                   VALUES ('${accFirstName}', '${accLastName}', '${accEmail}', '${accPassword}', '${accSchool}', ${accYear}, '${accStudy}', ${accBudget})`)
            .then((err, recordset) => {
              if (err) {
                res.status(500);
                res.json({ error: 'error', status: 500, info: err });
              } else {
                res.status(200);
                res.json({ success: 'success', status: 200 });
              }
            }).catch((queryErr) => {
              res.status(500);
              res.json({ error: 'error', status: 500, info: queryErr });
            });
        })
        .catch((err) => {
          res.status(500);
          res.json({ error: 'sql error', status: 500, info: err });
        });
    });

  accountRouter.route('/account/:accId')
    .get((req, res) => {
      // res.type('application/json');
      sql.connect(configuration.sqlConfig)
        .then(() => {
          new sql.Request().query(`select * from account where accId=${req.params.accId}`)
            .then((recordset) => {
              if (recordset.length === 0) {
                res.status(404);
                res.json({ error: 'error', status: 404, info: 'Not found' });
              }
              res.json(recordset[0]);
            }).catch((queryErr) => {
              res.status(500);
              res.json({ error: 'error', status: 500, info: queryErr });
            });
        })
        .catch((err) => {
          res.status(500);
          res.json({ error: 'sql error', status: 500, info: err });
        });
    })
    .put((req, res) => {
      res.send('PUT request for a single account.');
    })
    .patch((req, res) => {
      res.send('PATCH request for a single account.');
    })
    .delete((req, res) => {
      res.send('DELETE request for a single account.');
    });
});


module.exports = accountRouter;
