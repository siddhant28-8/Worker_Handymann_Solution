const express = require("express");
const path = require("path");
const worker_order_route = express.Router();
const {user, worker,Worker_data ,User_data} = require('../mongodb');

worker_order_route.get('/',async (req,res)=>{
 const worker_email=await req.session.worker_email;
    const worker=await Worker_data.findOne({email:worker_email});
    if(worker.order.length<=0){
        res.render('worker_empty_orders');
    }
    else{
        res.render('worker_order',{worker_orders:worker.order,worker:worker});
    }
});
worker_order_route.post('/',async (req,res)=>{
});


module.exports=worker_order_route;
