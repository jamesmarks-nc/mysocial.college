import sql from 'mssql';
import express from 'express';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';

import config from '../config.json';

const TOKEN_EXPIRY_TIME = 3600000; // 1 hour

const secret = uuid.v4();

const loginRouter = express.Router();

loginRouter
  .post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const connection = new sql.Connection(config.sql);

    connection.connect()
      .then(() => {

        let query = "SELECT * FROM ACCOUNT WHERE accEmail=@accEmail AND accPassword=accPassword";
        const ps = new sql.PreparedStatement(connection);
        ps.input("accEmail", sql.NVarChar(150));
        ps.input("accPassword", sql.NVarChar(50));
        ps.prepare(query)
          .then(() => {
            ps.execute({ accEmail: email, accPassword: password }, function(err, recordset, affected) {
              if(err) {
                res.json({ error: err });
              } else {
                if(recordset.length === 1) {
                  const accId = recordset[0].accId;
                  query = `SELECT * FROM ROLE WHERE accId=${accId}`;
                  let roles = [];
                  (new sql.Request(connection)).query(query)
                    .then(function (recordset) {
                      roles = recordset.length > 0 ? recordset.map(r => r.roleName) : [];
                      const exp = (new Date()).getTime() + TOKEN_EXPIRY_TIME; // 1 hour expiry
                      console.log("Date/Expiry: ", (new Date()).getTime(), exp, exp - (new Date()).getTime());
                      const token = jwt.sign({ accId: accId, exp, roles }, secret);
                      req.app.locals.tokens[token] = secret;
                      req.app.locals.accId = accId;
                      res.json({ token: token, exp, roles });
                    })
                    .catch(function (err) {
                      res.json({ error: "Error getting roles: " + err });
                    });
                } else {
                  res.json({ error: "Invalid login credentials." });
                }
              }
            })
          })
          .catch((err) => {
            res.json({ error: err });
          });

      })
      .catch((err) => {
        res.json({ error: err });
      });
  });

export { loginRouter };
