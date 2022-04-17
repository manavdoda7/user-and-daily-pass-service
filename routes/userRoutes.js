const User = require('../models/user');

const router = require('express').Router()

/**
 * @swagger
 * /api/users/:
 *  get:
 *      tags: ["User Routes"]
 *      parameters: []
 *      security:
 *          bearerAuth: []
 *      summary: "Route for viewing all the users."
 *      description: "This route lists all the users information."
 *      responses: 
 *          '200':
 *              description: Lists all the users.
 *          '408':
 *              description: Request timeout error.
 * /api/users/{username}:
 *  get:
 *      tags: ["User Routes"]
 *      parameters: 
 *        - name: username
 *          in: path
 *          description: Username
 *          required: true
 *          type: string
 *      security:
 *          bearerAuth: []
 *      summary: "Route for viewing the details of a particular user."
 *      description: "This route shows the details of a particular user."
 *      responses: 
 *          '200':
 *              description: Lists all the details of user.
 *          '403':
 *              description: Username doesn't exist.
 *          '408':
 *              description: Request timeout error.
 */

router.get('/', async(req, res)=>{
    console.log('GET /api/users request');
    try {
        let users  = await User.fetchAllUsers()
        users = users[0]
        for(let i=0;i<users.length;i++) delete users[i].password
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
        if(user.length==0) return res.status(403).json({success:false, message:'Invalid username'})
        user = user[0]
        delete user.password
        return res.status(200).json({success:true, user:user?user:[]})
    } catch(err) {
        console.log('Error in fetching user. ', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
})

module.exports = router