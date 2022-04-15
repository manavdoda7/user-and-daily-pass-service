const checkAuth = require('../middlewares/checkAuth')
const DailyPass = require('../models/dailyPass')
const dateValidator = require('../validators/dateValidator')
const router = require('express').Router()

router.post('/', checkAuth, async(req, res)=>{
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

module.exports = router