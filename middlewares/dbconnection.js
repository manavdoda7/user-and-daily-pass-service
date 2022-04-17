require('dotenv').config()
const mysql = require('mysql2')
const {createUser, createSession} = require('../controllers/sqlqueries')
const db_config_user = {
    host: process.env.DB,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE_USER,
    password:process.env.DB_PASSWORD,
    multipleStatements: true,
    timezone: process.env.TIMEZONE||"+05:30"
}

const db_config_daily_pass = {
    host: process.env.DB,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE_DAILYPASS,
    password:process.env.DB_PASSWORD,
    multipleStatements: true,
    timezone: process.env.TIMEZONE||"+05:30"
}

let db_user = mysql.createConnection(db_config_user)
let db_dailypass = mysql.createConnection(db_config_daily_pass)

// console.log(createChapters, createcontent);

db_user.promise().query(createUser)
    .then(result=>{
        console.log('User Table created,');
    })
    .catch(err=>{
        console.log('Error in creating user table. ', err);
    })

db_dailypass.promise().query(createSession)
    .then(result=>{
        console.log('Session Table created,');
    })
    .catch(err=>{
        console.log('Error in creating session table. ', err);
    })
    
setInterval(function () {
    db_user.query("Select 1");
    db_dailypass.query("Select 1");
}, 5000);

module.exports = {db_user, db_dailypass};