const express=require('express');
const body_parser=require('body-parser');
const path =require('path');
const confirm_service_route = express.Router();
const { user, worker,Worker_data,User_data } = require('../mongodb');

confirm_service_route.get('/',(req,res)=>{

    res.render('confirm_service',{});
});

confirm_service_route.post('/',async (req,res)=>{

  const { service, userInfo } = req.body;
  // You can validate or manipulate data here if needed
  res.render('confirm_service', {
    worker: service,
    user: userInfo
  });

});

module.exports=confirm_service_route;