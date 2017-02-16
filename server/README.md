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

## Configuration (config.json)

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
