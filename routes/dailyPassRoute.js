const checkAuth = require('../middlewares/checkAuth')
const DailyPass = require('../models/dailyPass')
const User = require('../models/user')
const dateValidator = require('../validators/dateValidator')
const router = require('express').Router()

/**
 * @swagger
 * /api/dailypass/:
 *  post:
 *      tags: ["Daily Pass Routes"]
 *      summary: "Route for making a new session."
 *      description: "This API makes an entry for the current date if it is not already there to keep a track of the days user has logged in."
 *      responses: 
 *          '200':
 *              description: Entry created.
 *          '403':
 *              description: User unauthorized.
 *          '408':
 *              description: Request timeout error.
 * /api/dailypass/{username}:
 *  post:
 *      tags: ["Daily Pass Routes"]
 *      summary: "Route for fetching the count of episodes user has unlocked."
 *      description: "Returns the number of days user has logged in after uploadDate of series."
 *      parameters:
 *        - name: username
 *          in: path
 *          description: "Username"
 *          required: true
 *          type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          date:
 *                              type: string
 *      responses: 
 *          '200':
 *              description: Returns count
 *          '403':
 *              description: Invalid username.
 *          '408':
 *              description: Request timeout error.
 *      security:
 *          bearerAuth: []
 * /api/dailypass/test/{username}:
 *  post:
 *      tags: ["Daily Pass Routes"]
 *      summary: "Route for making a dummy entry for testing purpose."
 *      description: "This route unlocks a new episode everytime we hit it with a username."
 *      parameters:
 *        - name: username
 *          in: path
 *          description: "Username"
 *          required: true
 *          type: string
 *      responses: 
 *          '200':
 *              description: Success
 *          '403':
 *              description: Invalid username.
 *          '408':
 *              description: Request timeout error.
 *      security:
 *          bearerAuth: []
 */

router.post('/', checkAuth, async(req, res)=>{
    console.log('POST /api/dailypass request')
    let d = new Date()
    let username = req.userData.username
    let date = String(d.getFullYear()) + "/" +  (String(d.getMonth()+1).length==1?`0${String(d.getMonth()+1)}`:String(1+d.getMonth())) + "/" + String(d.getDate())
    try {

        let pass = new DailyPass(username, date)
        let check = await pass.fetch()
        if(check[0].length) return res.status(200).json({success:true, message:'Success.'})
        await pass.save()
    } catch(err) {
        console.log('Error in saving daily-pass. ', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, message:'Success.'})
})

router.post('/:username', async(req, res)=> {
    console.log('POST /api/dailypass/username request')
    username = req.params.username
    // console.log(req.body);
    const {date} = req.body
    if(dateValidator(date)==0) return res.status(403).json({success:false, message:'Date format should be YYYY/MM/DD'})
    try {
        count = await DailyPass.fetchCount(username, date)
        count = count[0]
        count = count[0].count
        return res.status(200).json({success:true, count})
    } catch(err) {
        console.log('Error in fetching count', err);
        return res.send(408).json({success:false, message:'Please try again after sometime.'})
    }
})

router.post('/test/:username', async(req, res)=>{
    console.log('POST /api/dailypass/test/'+req.params.username+' request');
    try {
        let user = await User.fetchUser(username)
        user = user[0]
        if(user.length==0) return res.status(403).json({success:false, message:'Invalid username.'})
        let pass = new DailyPass(req.params.username, '9999/99/99')
        pass.save()
    } catch(err) {
        console.log('Error in test route', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, message:'Success'})
})

module.exports = router