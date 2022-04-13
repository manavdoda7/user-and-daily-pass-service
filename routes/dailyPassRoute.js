const checkAuth = require('../middlewares/checkAuth')
const DailyPass = require('../models/dailyPass')
const router = require('express').Router()

router.get('/', checkAuth, async(req, res)=>{
    console.log('GET /api/dailypass request')
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

module.exports = router