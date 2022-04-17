const jwt = require('jsonwebtoken')
const { fetchUser } = require('../models/user')
const db = require('./dbconnection').db_user
require('dotenv').config()

const checkAuth = async(req, res, next) => {
    let token
    try {
        if(req.headers.authorization==undefined) return res.status(403).json({success:false, message:'Token not found'})
        token = req.headers.authorization.split(" ")[1]
    } catch(err) {
        console.log('Token fetch error', err);
        return res.status(403).json({success:false, message:"token not found"})
    }
    // console.log(token);
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.userData = decode
        let user = await fetchUser(decode.username)
        user = user[0]
        if(user.length==0) return res.status(400).json('You\'re not authorised.')
        next()
    } catch(err) {
        console.log('JWT Token verification failed.', err);
        return res.status(401).json({success: true, error: "You're not authorized."})
    }
}
module.exports = checkAuth