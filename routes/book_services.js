const express = require('express');
const book_service_route = express.Router();
const path = require('path');
const { user, worker,Worker_data,User_data } = require('../mongodb');
const bodyParser = require("body-parser");


book_service_route.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../views/book_services.html'));
});

book_service_route.post('/', async (req,res)=>{
      const email = await req.session.user_email;
     const user =await User_data.findOne({email:email});
     const username=user.fullname;
     const { address,city,state,landmark,pincode,service_type,service_date,service_time,service_description } = req.body;  
     const userInfo = {
           username,
           email,
           address,
           city,
           state,
           landmark,
           pincode,
           service_type,
           service_date,
           service_time,
           service_description
         };
     const workers=await Worker_data.find({work_type:service_type,pincode:pincode});
     if(workers){
       res.render('services',{services:workers,userInfo:userInfo});
     }
     else {
       res.send("Service has not started at this location");
     }

});

module.exports = book_service_route;

