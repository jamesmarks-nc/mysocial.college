# MySocial.College

## Philosophy

The goal for this application is to display some usages of general data driven / 
database programming knowledge, especially for those who are just beginning their 
journey.

As a plethora of new ideas seem to be springing from this, the application may 
expand over time beyond it's original scope. In the meantime, the goal is simply
to have fun while educating a few people. 

If just one other person can learn from this application's development, it will have
done what it set out to do.

# Installation Info

## SQL Server database instance required

As this application is an unopinionated proof of concept for using 
Javascript + MS-TSQL to manage programming of a full stack web application, you will 
need a SQL Server or SQL vNext instance running on the machine which provides 
this application.

>**Note:** This is a gradually evolving application and so a database starter/installation 
>will be provided. 
>
>However, it should be understood that during this period of time said 
>script will change frequently, so if you choose to borrow this code and then update
>it in the future, you may have to manually re-run the starter scripts on your SQL
>instance, potentially destroying any data you may have accumulated in the meantime.

## config.json

To get things going, you'll need to add a **[config.json](config.json)** 
file to this directory (/server) which consists of a JSON object 
which has the following structure.

**[config.json](config.json)** must be imported in app.js.
It is not tracked, so you'll have to manually recreate it 
for every installation of this application.

### Example config.json file:
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

### Configuration properties:

#### app
 * **port** - the public port where you will serve your application. In production, you will usually want this to be port 80.

#### sql
 * **server** - The location (DNS or URL) of the SQL / vNext server which will server your database.
 * **instanceName** - The installed SQL server instance you want to use.
 * **database** - Database name for installed database. MySocial.College by convention, but this is up to you.
 * **user** - Username for a user with full DML CRUD capabilities on the SQL server instance.
 * **password** - SQL user's password.
 