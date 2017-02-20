import sql from 'mssql';
import express from 'express';
import path from 'path';

import config from '../config.json';

const loginRouter = express.Router();

loginRouter
  .get('/', (req, res) => {
    // res.sendFile(path.resolve(__dirname, '../../client/login.html'));
  })
  .post('/', (req, res) => {
    // res.sendFile(path.resolve(__dirname, '../../client/login.html'));
  });

export { loginRouter };
