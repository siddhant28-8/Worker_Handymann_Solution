const express=require('express');
const body_parser=require('body-parser');
const path =require('path');
const user_notification_route = express.Router();
const { user, worker,Worker_data,User_data } = require('../mongodb');

user_notification_route.get('/',async (req,res)=>{
    const user_email= await req.session.user_email;
    const user=await User_data.findOne({email:user_email});
    if(user.notification.length<=0){
        res.render('user_empty_notification');
    }
    else{
        res.render('user_notification',{notifications:user.notification});
    }
});

user_notification_route.post('/', async (req, res) => {

});


module.exports=user_notification_route;