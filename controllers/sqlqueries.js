let createUser = "create table if not exists user(" +
                "username varchar(75) primary key," +
                "fName varchar(75)," +
                "lName varchar(75)," +
                "email varchar(150)," +
                "contactNumber varchar(10)," +
                "password varchar(250));"

let createSession = "create table if not exists session(" +
                "username varchar(75)," +
                "session varchar(15)," +
                "primary key(username, session)," +
                "foreign key (username) references user(username) on delete cascade on update cascade);"

module.exports = {createUser, createSession}