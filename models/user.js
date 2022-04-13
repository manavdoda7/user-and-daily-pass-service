const db = require('../middlewares/dbconnection')
class User {
    constructor(username, fName, lName, email, phone, password) {
        this.username = username
        this.fName = fName
        this.lName = lName
        this.email = email
        this.phone = phone
        this.password = password
    }
    async save() {
        return db.promise().query(`insert into user values('${this.username}', '${this.fName}', '${this.lName}', '${this.email}', '${this.phone}', '${this.password}');`)
    }
    static async checkDuplicateEmail(email) {
        return db.promise().query(`select * from user where email = '${email}'`)
    }
    static async checkDuplicatePhone(phone) {
        return db.promise().query(`select * from user where contactNumber = '${phone}'`)
    }
    static async checkDuplicateUsername(username) {
        return db.promise().query(`select * from user where username = '${username}'`)
    }
    static async fetchAllUsers() {
        return db.promise().query(`select * from user;`)
    }
    static async fetchUser(username) {
        return db.promise().query(`select * from user where username='${username}'`)
    }
}

module.exports = User