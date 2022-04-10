const mysql=require('mysql2');

/*
There are 2 ways to connect to a SQL database : 

1) To set up one connection which we can then use to run queries and we should always close the connection after we are done with a query. So the downside is we need to re-establish the connection everytime we want to run a query. Creating new connection all the time becomes every inefficient.

2) Create a connection pool: which is a pool of connection which allows us to always reach out to it whenever we have a query to run and then we get a new connection from that pool which manages multiple connections so that we can run mutiple connections and once the query is done the connection will be handed back to pool and its available for a new query. And pool can be finished when application shuts down.

*/

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    database:'node_schema',
    password:'Mohit1234'
});

module.exports=pool.promise(); // make the handling of async code easier.