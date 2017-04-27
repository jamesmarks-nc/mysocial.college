// Load the express module to manage our http server.
import express from 'express';
import path from 'path';
// Load bodyparser to parse our JSON request data
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken'; // https://www.npmjs.com/package/jsonwebtoken

import chalk from 'chalk';

// Import configuration
import config from './config.json';
// Load up routers.
import * as routers from './routers';

// Associative array of token => { accId, expiryTime } 
//   (i.e. { "ASDF12341234": { accId: 1, expiryTime: Date(2017,3,1,14,33,33,983) } })
const tokens = {};

// TODO: Periodically find and remove expired JWTs
const removeExpiredJWTs = function() {
  console.log("TODO: Remove expired JWTs");
}
const JWT_EXPIRY_CHECK_TIMEOUT = (60 * 60 * 1000); // Every hour: minutes * seconds * milliseconds
setTimeout(removeExpiredJWTs, JWT_EXPIRY_CHECK_TIMEOUT);

// create and get a pointer to the express app.
const app = express();

// Mount configuration to app (for routes)
app.locals.config = config;
app.locals.tokens = tokens;
app.locals.accId = null;

// Serve "static"" user interface files.
app.use(express.static('./client')); 
// !!!Important!!!: This can only work if node is launched from the top-level project directory, 
// do not launch app.js with node from the same directory where app.js resides (this directory) 
// or static files may not be correctly served to clients.

// parse incoming json data
app.use(bodyParser.json());

// Handle logins first, authenticate afterward.
app.use(routers.loginRouter);

// Authenticate: Ensure login token is valid and that it exists in our tokens list.
app.use(function(req,res,next) {

  const authToken = req.header('X-Auth-Token');
  let decoded = null;
  try {
    decoded = jwt.verify(authToken, tokens[authToken]);
    
    if(Object.keys(tokens).indexOf(authToken) !== -1) {
      if(routers.rolesMap[req.method] || routers.rolesMap["ANY"]) {
        const routing = routers.rolesMap[req.method] || routers.rolesMap["ANY"];
        const route = Object.keys(routing).find(key => req.originalUrl.indexOf(key) === 0);
        if(!route) {
          // TODO: throw error somehow
        } 
        
        const routeRoles = routing[route]; 

        if(routeRoles.indexOf('public') !== -1 
           || routeRoles.some(rr => decoded.roles.indexOf(rr) !== -1)) {
          next();
          return;
        } else {
          res.status(401);
          res.json({ error: "Unauthorized. Role not present." });
          return;
        }
      }
    }
  } catch(err) {
    /*
      err = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: 1408621000
      }
    */
    res.status(401);
    res.send("error getting jwt.");
    //res.json(err);
    return;
  }
});

// then run all other routes through the various routers.
app.use(routers.accountRouter);
app.use(routers.postRouter);

// serve static files
app.use(express.static('client'));

// and finally, listen on the configured port.
app.listen(config.port, () => {
  console.log(chalk.bold.bgBlue("API Server Started."));
  console.log(`Listening on ${chalk.bold.green(config.port)}.`);
});
