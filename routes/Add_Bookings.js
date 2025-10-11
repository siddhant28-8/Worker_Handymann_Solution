const express=require('express');
const { v4: uuidv4 } = require('uuid');
const body_parser=require('body-parser');
const path =require('path');
const add_bookings_route = express.Router();
const { user, worker,Worker_data,User_data } = require('../mongodb');

add_bookings_route.get('/',(req,res)=>{
    const{worker_notification,worker}=req.body;

});


add_bookings_route.post('/',async (req,res)=>{
console.log('Enter in add bookings');
 const{worker_notification,worker_email}=req.body;
 const workerEmail=worker_email;
 const user_email=worker_notification.clientEmail;
 const notification_Id=worker_notification.notificationId;
 const worker=await Worker_data.findOne({email:workerEmail});
 const user =await User_data.findOne({email:user_email});
  const START_OTP = Math.floor(1000 + Math.random() * 9000);
  const END_OTP = Math.floor(1000 + Math.random() * 9000);

  const user_not_length=user.notification.length;
  let user_picture='';
  for (let i=0;i<user_not_length;i++){
   if(user.notification[i].notificationId==notification_Id){
   user.notification[i].status="confirmed";
   user_picture=user.notification[i].picture;
   await user.save();
   }
  }

 const length=worker.notification.length;
 for(let i=0;i<length;i++){
    if(worker.notification[i].notificationId==notification_Id){
        const booking_Id=uuidv4();
        const worker_order={
            orderId:booking_Id ,
            notificationId:notification_Id,
            clientEmail:user_email, 
            clientname:worker.notification[i].clientname,
            contact:user.contact,
            typeofservice:worker.notification[i].typeofservice,
            timeofservice:worker.notification[i].timeofservice,
            dateofservice:worker.notification[i].dateofservice,
            status:"pending",
            start_otp: START_OTP,
            end_otp: END_OTP,
            picture:worker.notification[i].picture
    };
    worker.order.push(worker_order);

    const user_bookings={
    bookingId:booking_Id,
    notificationId:notification_Id,
    workerEmail:worker.email, 
    workername:worker.firstname+" "+worker.surname ,
    contact: worker.contact ,
    typeofservice:worker.notification[i].typeofservice,
    timeofservice:worker.notification[i].timeofservice,
    dateofservice:worker.notification[i].dateofservice,
    start_otp: START_OTP,
    end_otp: END_OTP,
    picture:user_picture
	};
    

   user.bookings.push(user_bookings);

   worker.notification.splice(i, 1); // remove 1 item at index i
   
    //  Save both modified documents
    await worker.save();
    await user.save();
    res.status(200).json({ redirect: '/Worker_order' });
   // break; // stop loop after removing the matched notification
   
 }
 }
});


module.exports=add_bookings_route;