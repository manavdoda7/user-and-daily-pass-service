require('dotenv').config()
const mysql = require('mysql2')
const {createUser, createSession} = require('../Controllers/sqlQueries')
const db_config = {
    host: process.env.DB,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    // password:process.env.DB_PASSWORD,
    multipleStatements: true,
    timezone: process.env.TIMEZONE||"+05:30"
}

let db = mysql.createConnection(db_config)

// console.log(createChapters, createcontent);

db.promise().query(createUser + createSession)
    .then(result=>{
        console.log('Tables created,' , result);
    })
    .catch(err=>{
        console.log('Error in creating tables ', err);
    })
    
setInterval(function () {
    db.query("Select 1");
}, 5000);

module.exports = db;