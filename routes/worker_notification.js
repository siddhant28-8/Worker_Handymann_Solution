const express=require('express');
const body_parser=require('body-parser');
const path =require('path');
const worker_notification_route = express.Router();
const { user, worker,Worker_data,User_data } = require('../mongodb');

worker_notification_route.get('/',async (req,res)=>{
    const worker_email= await req.session.worker_email;
    const worker=await Worker_data.findOne({email:worker_email});
    if(worker.notification.length<=0){
        res.render('worker_empty_notification');
    }
    else{
        res.render('worker_notification',{notifications:worker.notification,worker:worker});
    }
});

worker_notification_route.post('/', async (req, res) => {

});


module.exports=worker_notification_route;