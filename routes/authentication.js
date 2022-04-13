const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const url  = require('../url')
const axios = require('axios')

const router = require('express').Router()

router.post('/signup', async(req, res)=>{
    console.log('POST /api/authenticate/signup request');
    const {username, fName, lName, email, phone, password} = req.body
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