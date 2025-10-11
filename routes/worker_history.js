const express=require('express');
const body_parser=require('body-parser');
const path =require('path');
const worker_history_route = express.Router();
const { user, worker,Worker_data,User_data } = require('../mongodb');

worker_history_route.get('/',async (req,res)=>{
    const worker_email=req.session.worker_email;
    const worker=await Worker_data.findOne({email:worker_email});
    if(worker.history.length<=0){
        res.render('worker_empty_history');
    }
    else{
        res.render('worker_history',{history_data:worker.history,worker:worker});
    }
});

worker_history_route.post('/', async (req, res) => {

});


module.exports=worker_history_route;