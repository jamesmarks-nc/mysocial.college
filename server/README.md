# Installation Info

## Configuration

To get things going, you'll need to add a **[config.json](config.json)** 
file to this directory (/server) which consists of a JSON object 
which has the following structure.

```JSON
{
  "db_host": "localhost",
  "db_inst": "SQLEXPRESS",
  "db_name": "MySocial.College",
  "db_user": "sa",
  "db_pass": "root"
}
```

**[config.json](config.json)** must be imported in several
scripts that are critical to the operation of the application.
It is not tracked, so you'll have to manually recreate it 
for every installation of this application.