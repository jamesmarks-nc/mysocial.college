import sql from 'mssql';
import express from 'express';

// const config = require('../config.json');

const fieldMap = {
  postId: sql.Int,
  postBody: sql.NVarChar(140),
  postTag: sql.NVarChar(50),
  postURL: sql.NVarChar(150),
  postThumbsUp: sql.Int,
  postThumbsDown: sql.Int,
  postDate: sql.DateTime2(7),
  accId: sql.Int
};

export const postRouter = express.Router();

postRouter.get('/posts', (req, res) => {
  sql.connect(req.app.locals.config.sql)
    .then(() => {
      new sql.Request().query('select * from uvPost')
        .then(recordset => !recordset ? res.status(404).json({}) :  res.status(200).json(recordset))
        .catch(queryErr => res.status(500).json({ error: 'error', info: queryErr }));
    })
    .catch((err) => res.status(500).json({ error: 'sql error', info: err }));
});

postRouter.get('/posts/:accId', (req, res) => {
  sql.connect(req.app.locals.config.sql)
    .then(() => {
      new sql.Request().query(`select * from uvPost where accId=${req.params.accId}`)
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

postRouter.route('/post/:postId')
  .get((req, res) => {
    sql.connect(req.app.locals.config.sql)
      .then( () => {
        new sql.Request().query(`select * from uvPost where postId=${req.params.postId}`)
          .then(recordset => res.status(200).json(recordset))
          .catch(queryErr => res.status(500).json({ error: 'error', info: queryErr }));
      })
      .catch(err => {
        console.error(err);
      })
  })
  .put((req, res) => {
    const connection = sql.connect(req.app.locals.config.sql)
      .then( () => {

        const { postBody, postTag, postURL, postThumbsUp, postThumbsDown } = req.body;

        const ps = sql.PreparedStatement(connection);

        const query = 'UPDATE POST SET postBody=@postBody, postTag=@postTag, postURL=@postURL, postThumbsUp=@postThumbsUp, postThumbsDown=@postThumbsDown WHERE postId=@postId';
        [ 'postBody', 'postTag', 'postURL', 'postThumbsUp', 'postThumbsDown', 'postId' ]
          .forEach( (key) => {
            ps.input(key, fieldMap[key]);
          });

        ps.prepare(query)
          .then(function(statement, err) {
            if (err) {

            } else {
              ps.execute( Object.assign({}, req.body, { postId: req.params.postId }),
                function(err, recordset, affected) {

                }
              );
            }
          })
      })
  });
