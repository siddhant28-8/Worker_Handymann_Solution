const path=require('path');
const express=require('express');
const otp_route=express.Router();
const { user, worker,Worker_data,User_data } = require('../mongodb');

otp_route.get('/view', async (req, res) => {
    // Parse and decode the query parameter
    const user_email  =  req.session.user_email;
    const bookingInfo =  req.session.bookingInfo; // retrieve from session
    res.render('add_otp', { bookingInfo, user_email });
});


otp_route.post("/", async (req, res) => {
    // bookingInfo is a plain object, not a string
    const { bookingInfo } = req.body;
    const user_email  =  req.session.user_email;
    req.session.bookingInfo = bookingInfo;     // save entire object in session
    // Safely encode the JSON so it can be placed in a query string
    const encoded = encodeURIComponent(JSON.stringify(bookingInfo));

    // Send back a JSON response telling the client where to go next
    res.json({
        redirect: `/Work_In_Progress/view`
    });
});

// When timer stops, client posts to this route
otp_route.post('/payment', async (req, res) => {
  try {
    const { bookingInfo, totalTime } = req.body;

    // Save totalTime or update DB as needed
    // await YourModel.update(...)
    const Price = (parseInt(totalTime.split(':')[0]) * 200)==0?200:(parseInt(totalTime.split(':')[0]) * 200);
    // Save details in session for the payment page
    req.session.paymentData = { bookingInfo, totalTime ,Price};

    // Tell client to go to Razorpay checkout page
    res.json({ redirect: '/Work_In_Progress/pay-now' });
  } catch (err) {
    console.error('Payment route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Render a payment page that initializes Razorpay
otp_route.get('/pay-now', async (req, res) => {
  const { bookingInfo, totalTime ,Price } =  req.session.paymentData || {};
  const RAZORPAY_KEY=process.env.RAZORPAY_KEY;
  res.render('pay_now', { bookingInfo, totalTime ,Price ,RAZORPAY_KEY});
});

otp_route.post('/payment/success', async (req, res) => {
  try {
    const { razorpay_payment_id } = req.body;
    const { bookingInfo, totalTime ,Price } = req.session.paymentData || {};

    if (!razorpay_payment_id || !bookingInfo) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // ✅ Delete booking & order
    const worker_email=bookingInfo.workerEmail;
    const user_email  = req.session.user_email;
    const bookingId=bookingInfo.bookingId;
    
    const worker=await Worker_data.findOne({email:worker_email});
    const user =await User_data.findOne({email:user_email});

    const worker_length=worker.order.length;
    for(let i=0;i<worker_length;i++){
    if(worker.order[i].orderId==bookingId){
        const worker_history={
            clientname:worker.order[i].clientname ,
            issue_name:worker.order[i].typeofservice ,
            totaltimeofservice:totalTime,
            dateofservice:worker.order[i].dateofservice,
            status:"completed",
            price:Price,
            picture:worker.order[i].picture
    };
    worker.history.push(worker_history);
    worker.order.splice(i, 1); 
    await worker.save();
    console.log("worker_history_added");
    break;
  }
}
 let notification_Id;
 const user_length=user.bookings.length;
 for(let i=0;i<user_length;i++){
    if(user.bookings[i].bookingId==bookingId){
        const user_history={
              worker_name:user.bookings[i].workername ,
              issue_name:user.bookings[i].typeofservice ,
              totaltimeofservice:totalTime,
              dateofservice:user.bookings[i].dateofservice,
              price:Price,
              picture:user.bookings[i].picture
             };
    notification_Id=user.bookings[i].notificationId;
    user.history.push(user_history);
    user.bookings.splice(i, 1);
    console.log("user_history_added");
    break;
  }
}

 for(let i=0;i<user.notification.length;i++){
   if(user.notification[i].notificationId==notification_Id){
   user.notification.splice(i,1);
   await user.save();
   console.log("user_notification_removed");
   break;
   }
  }


    // ✅ Send redirect location back to client
    res.json({ redirect: '/User_Dashboard' });
  } catch (err) {
    console.error('Payment success route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports=otp_route;