const db = require("../middlewares/dbconnection")

class DailyPass {
    constructor(username, date) {
        this.username = username
        this.date = date
    }
    async save() {
        return db.promise().query(`insert into session values('${this.username}', '${this.date}');`)
    }
    async fetch() {
        return db.promise().query(`select * from session where username = '${this.username}' and session = '${this.date}'`)
    }
}

module.exports = DailyPass