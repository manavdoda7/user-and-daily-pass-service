const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const url  = require('../url')
const axios = require('axios');
const UsernameValidator = require('../validators/usernameValidator');
const nameValidator = require('../validators/nameValidator');
const emailValidator = require('../validators/emailValidator')
const phoneValidator = require('../validators/mobileValidator')
const passwordValidator = require('../validators/passwordValidator')

const router = require('express').Router()


/**
 * @swagger
 * /api/authenticate/signup:
 *  post:
 *      tags: ["User Authentication Routes"]
 *      summary: "Route for registering a new user."
 *      description: "Register for a new user here."
 *      parameters: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          fName:
 *                              type: string
 *                          lName:
 *                              type: string
 *                          email:
 *                              type: string
 *                          phone:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses: 
 *          '201':
 *              description: User Registered
 *          '403':
 *              description: Incorrect/Duplicate information entered.
 *          '408':
 *              description: Request timeout error.
 *      security:
 *          bearerAuth: []
 * /api/authenticate/signin:
 *  post:
 *      tags: ["User Authentication Routes"]
 *      summary: "Route for user login."
 *      description: "Enter email and password to login"
 *      parameters: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses: 
 *          '202':
 *              description: User Logged In(Returns a JWT token)
 *          '403':
 *              description: Incorrect/missing credentials.
 *          '408':
 *              description: Request timeout error.
 *      security:
 *          bearerAuth: []
 */

router.post('/signup', async(req, res)=>{
    console.log('POST /api/authenticate/signup request');
    const {username, fName, lName, email, phone, password} = req.body
    // console.log(req.body);
    if(UsernameValidator(username)==0 || nameValidator(fName)==0 || nameValidator(lName)==0 || emailValidator(email)==0 || phoneValidator(phone)==0 || passwordValidator(password)==0) return res.status(403).json({success:false, message:'One or more feild values is/are missing or incorrect.'})
    try {
        let user = await User.checkDuplicateUsername(username)
        if(user[0].length) return res.status(403).json({success:false, message:'Username already taken.'})
        user = await User.checkDuplicateEmail(email)
        if(user[0].length) return res.status(403).json({success:false, message:'Email already exists.'})
        user = await User.checkDuplicatePhone(phone)
        if(user[0].length) return res.status(403).json({success:false, message:'Phone number already exists.'})
        var hashedPassword = await bcrypt.hash(password, 10);
        user = new User(username, fName, lName, email, phone, hashedPassword)
        user.save()
    } catch(err) {
        console.log('Error in user registration.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(201).json({success:true, message:'User created'})
})

router.post('/signin', async(req, res)=>{
    console.log('POST /api/authenticate/login request');
    const {username, password} = req.body
    // console.log(req.body);
    let user
    try {
        user = await User.fetchUser(username)
        user = user[0]
        if(user.length) user = user[0]
        else return res.status(403).json({success:false, message:'Invalid username or password.'})
        bcrypt.compare(password, user.password, (bcryptErr, result)=>{
            if(bcryptErr) {
                console.log('bcrypt Error', bcryptErr);
                return res.status(408).json({success:false, message:'Please try again after sometime.'})
            }
            if(!result) {
                return res.status(403).json({success:false, message:'Invalid username or password.'})
            }
        })
    } catch(err) {
        console.log('Error in login ', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    const token = jwt.sign({
            username: user.username,
        }, 
        process.env.JWT_SECRET, {
            expiresIn: '2h'
        })
    // console.log(url);
    await axios.post(url+'api/dailypass', {"body": ""}, {
        headers: {
            authorization: 'Bearer '+token
        }
    })
    .then((response)=>{
        console.log(response);
    })
    return res.status(202).json({success:true, message:'Authenication successfull.', token:token})
})

module.exports = router