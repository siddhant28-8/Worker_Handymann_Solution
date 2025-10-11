const express=require('express');
const body_parser=require('body-parser');
const path =require('path');
const user_history_route = express.Router();
const { user, worker,Worker_data,User_data } = require('../mongodb');

user_history_route.get('/',async (req,res)=>{
    const user_email= await req.session.user_email;
    const user=await User_data.findOne({email:user_email});
    if(user.history.length<=0){
        res.render('user_empty_history');
    }
    else{
        res.render('user_history',{history_data:user.history});
    }
});

user_history_route.post('/', async (req, res) => {

});


module.exports=user_history_route;