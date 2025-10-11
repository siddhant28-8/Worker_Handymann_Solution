const express=require('express');
const { v4: uuidv4 } = require('uuid');
const body_parser=require('body-parser');
const path =require('path');
const add_notification_route = express.Router();
const { user, worker,Worker_data,User_data } = require('../mongodb');

add_notification_route.get('/',(req,res)=>{
    res.render('user_dashboard',{});
});

add_notification_route.post('/', async (req, res) => {
  let { worker_info, user_info } = req.body;
  const user_email = user_info.email;
  const worker_email = worker_info.email;
  const worker = await Worker_data.findOne({ email: worker_email });
  const  worker_picture = worker.picture;
  const user = await User_data.findOne({ email: user_email });
  const  user_picture = user.picture;
  const notification_Id=uuidv4();
  const user_notification = {
    workerEmail:worker_email,
    notificationId:notification_Id,
    worker_name: worker_info.firstname + " " + worker_info.surname,
    worker_pending_work: worker_info.pending,
    typeofservice: user_info.service_type,
    timeofservice: user_info.service_time,
    dateofservice: user_info.service_date,
    status: "received",
    picture:worker_picture
  };

  const worker_notification = {
    clientEmail:user_email,
    notificationId:notification_Id,
    clientname:    user_info.username,
    typeofservice: user_info.service_type,
    timeofservice: user_info.service_time,
    dateofservice: user_info.service_date,
    picture:user_picture
  };


  if (!worker || !user) {
    return res.status(404).send("User or worker not found.");
  }

  // Save notification
worker.notification.push(worker_notification);
await worker.save();

user.notification.push(user_notification);
await user.save();

//res.render('user_dashboard',{user});
res.status(200).json({ redirect: '/User_Dashboard' });
});


module.exports=add_notification_route;