const sql = require('mssql');
const express = require('express');
const path = require('path');

const config = require('../config.json');

const loginRouter = express.Router();

loginRouter
  .get('/', (req, res) => {
    // res.sendFile(path.resolve(__dirname, '../../client/login.html'));
  })
  .post('/', (req, res) => {
    // res.sendFile(path.resolve(__dirname, '../../client/login.html'));
  });

module.exports = loginRouter;
