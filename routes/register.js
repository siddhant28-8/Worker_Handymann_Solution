// routes/register.js
const express = require('express');
const RegisterRouter = express.Router();
const bcrypt=require('bcrypt');
const path =require('path');
const {user,worker}=require('../mongodb')

RegisterRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
  });

  // post requests  for signup page 
  RegisterRouter.post('/',async (req,res)=>{
    const { Email, Password ,role} = req.body; 
   
   try {
   
    if(role=='user'){
        const Existing_user=user.findOne({Email});
        if(!Existing_user){
            res.send("User Already Registered ");
            return;
        }
        else{
        const newUser = new user({Email, Password});
        const salt = await bcrypt.genSalt(10);
        newUser.Password = await bcrypt.hash(Password, salt);
        const savedUser = await newUser.save();
        console.log('User inserted:', savedUser);
        }
    }    
    if(role=='worker') {
        const Existing_worker=worker.findOne({Email});
        if(!Existing_worker){
            res.send("Worker Already Registered ");
            return;
        }
        else{
        const newWorker = new worker({Email, Password});
        const salt = await bcrypt.genSalt(10);
        newWorker.Password = await bcrypt.hash(Password, salt);
        const savedUser = await newWorker.save();
        console.log('Worker inserted:', savedUser);
        }
    }
    
} catch (err) {
    console.error('Error inserting user:', err);
}

  res.redirect('signin.html');
 // res.sendFile(__dirname + '/views/sigin.html');

});
 
module.exports = RegisterRouter;
