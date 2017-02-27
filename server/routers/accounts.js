import sql from 'mssql';
import express from 'express';

import config from '../config.json';

const fieldMap = {
  accId: sql.Int,
  accFirstName: sql.NVarChar(50),
  accLastName: sql.NVarChar(50),
  accEmail: sql.NVarChar(150),
  accPassword: sql.NVarChar(50),
  accSchool: sql.NVarChar(100),
  accStudy: sql.NVarChar(100),
  accYear: sql.Int,
  accBudget: sql.Decimal(9,2)
};

const accountRouter = express.Router();

accountRouter.get('/accounts', (req, res) => {
  res.type('application/json');
  sql.connect(config.sql)
    .then(() => {
      new sql.Request().query('select * from account')
        .then((recordset) => {
          res.json(recordset);
        }).catch((queryErr) => {
          res.json({ error: 'error', info: queryErr });
        });
    })
    .catch((err) => {
      res.json({ error: 'sql error', info: err });
    });
});

accountRouter.route('/account')
  .post(function(req, res) {
    const connection = new sql.Connection(config.sql);

    connection.connect().then(() => {
      const { accFirstName, accLastName, accEmail, accPassword, accSchool, accYear, accStudy, accBudget } = req.body;

      const ps = new sql.PreparedStatement(connection);

      ['accFirstName', 'accLastName', 'accEmail', 'accPassword', 'accSchool', 'accStudy', 'accYear', 'accBudget']
        .forEach((key) => {
          ps.input(key, fieldMap[key]);
        });

      const query = `INSERT INTO account (accFirstName, accLastName, accEmail, accPassword, accSchool, accStudy, accYear, accBudget)
                   VALUES (@accFirstName, @accLastName, @accEmail, @accPassword, @accSchool, @accStudy, @accYear, @accBudget);`;
      
      ps.prepare(query).then(function(statement, err) {
        if(err) {
          res.status(500);
          res.json({ error: 'error', status: 500, info: {} });
        } else {
          ps.execute( { accFirstName, accLastName, accEmail, accPassword, accSchool, accStudy, accYear, accBudget },
            function(err, recordset, affected) {
              if(err) {
                res.status(500);
                res.json({ error: 'error', status: 500, info: err });
              } else {
                res.status(200);
                res.json({ success: 'success', status: 200, recordset, affected });
                ps.unprepare(function(err) {
                  if (err) { /* TODO: What should I do with this? */ }
                });
              } 
            }
          );
        }
      })
      .catch(err => {
        console.log("Got an error here: ", err);
        res.send('frick');
      });
    })
    .catch(err => {
      console.log("error", err);
    })

  })

accountRouter.route('/account/:accId')
  .get((req, res) => {
    
    const connection = new sql.Connection(config.sql);

    connection.connect()
      .then(() => {

        const query = 'select * from account where accId=@accId';
        const ps = new sql.PreparedStatement(connection);

        ps.input('accId', sql.Int);

        ps.prepare(query).then(function(statement, err) {
          ps.execute({accId: req.params.accId}, function(err, recordset, affected) {
            if(err) {
              res.status(500);
              res.json({ error: 'error', status: 500, info: err });
            } else {
              res.status(200);
              res.json({ success: 'success', status: 200, recordset: recordset[0], affected });
              ps.unprepare(function(err) {
                if (err) { /* TODO: What should I do with this? */ }
              });
            } 
          });
        })
      })
      .catch((err) => {
        res.status(500);
        res.json({ error: 'sql error', status: 500, info: err });
      });
  })
  .put((req, res) => {
    const connection = new sql.Connection(config.sql);

    connection.connect()
      .then(() => {

        const query = 'update account set accFirstName=@accFirstName, accLastName=@accLastName, accEmail=@accEmail, accPassword=@accPassword, accSchool=@accSchool, accStudy=@accStudy, accYear=@accYear, accBudget=@accBudget where accId=@accId';

        const ps = new sql.PreparedStatement(connection);

        // ps.input('accId', sql.Int);
        // ps.input('accFirstName', sql.NVarChar(50));
        // ps.input('accLastName', sql.NVarChar(50));
        // ps.input('accEmail', sql.NVarChar(150));
        // ps.input('accPassword', sql.NVarChar(50));
        // ps.input('accSchool', sql.NVarChar(100));
        // ps.input('accStudy', sql.NVarChar(100));
        // ps.input('accYear', sql.Int);
        // ps.input('accBudget', sql.Decimal(9,2));
        ['accId', 'accFirstName', 'accLastName', 'accEmail', 'accPassword', 'accSchool', 'accStudy', 'accYear', 'accBudget']
          .forEach((key) => {
            ps.input(key, fieldMap[key]);
          });

        ps.prepare(query).then(function(statement, err) {

          const psParams = Object.assign( {}, req.body );
          ps.execute(psParams, function(err, recordset, affected) {
            if(err) {
              res.status(500);
              res.json({ error: 'error', status: 500, info: err });
            } else {
              res.status(200);
              res.json({ success: 'success', status: 200, recordset: recordset[0], affected });
              ps.unprepare(function(err) {
                if (err) { /* TODO: What should I do with this? */ }
              });
            } 
          });
        })
      })
      .catch((err) => {
        res.status(500);
        res.json({ error: 'sql error', status: 500, info: err });
      });
  })
  .patch((req, res) => {

    const connection = new sql.Connection(config.sql);

    connection.connect()
      .then(() => {
        const ps = new sql.PreparedStatement(connection);

        let updatePairs = [];
        for (let key in req.body) {
          if (key !== 'accId') {
            updatePairs.push(`${key}=@${key}`);
          }
          ps.input(key, fieldMap[key]);
        }
        const query = 'update account set ' + updatePairs.join(', ') + ' where accId=@accId';

        ps.prepare(query).then(function(statement, err) {
          const psParams = Object.assign( {}, req.body );

          ps.execute(psParams, function(err, recordset, affected) {
            if(err) {
              res.status(500);
              res.json({ error: 'error', status: 500, info: err });
            } else {
              res.status(200);
              res.json({ success: 'success', status: 200, recordset: recordset[0], affected });
              ps.unprepare(function(err) {
                if (err) { /* TODO: What should I do with this? */ }
              });
            } 
          });
        }).catch(err => {
          res.status(500);
          res.json({ error: 'prepare error', status: 500, info: err });
        });
      })
      .catch((err) => {
        res.status(500);
        res.json({ error: 'sql error', status: 500, info: err });
      });
  })
  .delete((req, res) => {

    const connection = new sql.Connection(config.sql);

    connection.connect()
      .then(() => {
        const ps = new sql.PreparedStatement(connection);

        ps.input('accId', fieldMap['accId']);
        const query = 'delete from account where accId=@accId';

        ps.prepare(query).then(function(statement, err) {
          const psParams = Object.assign( {}, req.body );

          ps.execute(psParams, function(err, recordset, affected) {
            if(err) {
              res.status(500);
              res.json({ error: 'error', status: 500, info: err });
            } else {
              res.status(200);
              res.json({ success: 'success', status: 200, affected });
              ps.unprepare(function(err) {
                if (err) { /* TODO: What should I do with this? */ }
              });
            } 
          });
        }).catch(err => {
          res.status(500);
          res.json({ error: 'prepare error', status: 500, info: err });
        });
      })
      .catch((err) => {
        res.status(500);
        res.json({ error: 'sql error', status: 500, info: err });
      });
  });

export { accountRouter };