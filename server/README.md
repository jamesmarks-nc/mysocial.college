# Installation Info

## Configuration

To get things going, you'll need to add a **[config.json](config.json)** 
file to this directory (/server) which consists of a JSON object 
which has the following structure.

```JSON
{
  "app": {
    "port": 3000
  },
  "sql": {
    "server": "localhost",
    "instanceName": "SQLEXPRESS",
    "database": "MySocial.College",
    "user": "sa",
    "password": "root"
  }
}
```

**[config.json](config.json)** must be imported in app.js.
It is not tracked, so you'll have to manually recreate it 
for every installation of this application.