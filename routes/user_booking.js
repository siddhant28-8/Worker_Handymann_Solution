const express=require('express');
const body_parser=require('body-parser');
const path =require('path');
const user_booking_route = express.Router();
const { user, worker,Worker_data,User_data } = require('../mongodb');

user_booking_route.get('/',async (req,res)=>{
    const user_email=req.session.user_email;
    const user=await User_data.findOne({email:user_email});
    if(user.bookings.length<=0){
       res.render('user_empty_bookings');
    }
    else{
        res.render('user_booking',{user_bookings:user.bookings});

    }
});

user_booking_route.post('/', async (req, res) => {

});


module.exports=user_booking_route;