const User = require('../models/user');

const router = require('express').Router()

router.get('/', async(req, res)=>{
    console.log('GET /api/users request');
    try {
        let users  = await User.fetchAllUsers()
        users = users[0]
        return res.status(200).json({success:true, users:users})
    } catch(err) {
        console.log('Error in fetching users. ', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
})

router.get('/:username', async(req, res)=>{
    console.log(`GET /api/users/${req.params.username} request`);
    try {
        let user = await User.fetchUser(req.params.username)
        user = user[0]
        user = user[0]
        return res.status(200).json({success:true, user:user?user:[]})
    } catch(err) {
        console.log('Error in fetching user. ', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
})

module.exports = router