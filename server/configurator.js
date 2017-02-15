const fs = require('fs');

function configurator() {
  const c = {
    appConfig: {},
    sqlConfig: {},
    readyState: false,
  };

  const prom = new Promise((res, rej) => {

    fs.readFile('./server/config.json', (readErr, data) => {
      if (readErr) throw readErr;
      const config = JSON.parse(data);
      c.appConfig = config;

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
      c.sqlConfig = sqlConfig;

      c.readyState = true;
      console.log('Got new config');
      res(c);
    });
  });

  return prom;
}

module.exports = configurator;
