const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const { user, worker,Worker_data,User_data } = require('../mongodb');
const bodyParser = require("body-parser");


loginRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../views/signin.html'));
});

loginRouter.post('/', async (req, res) => {
  const { Email, Password, role } = req.body;
  if (role === 'user') {
    const user1 = await user.findOne({ Email });

    if (!user1) {
      return res.status(400).send('User Not Registered');
    }

    const isMatch = await bcrypt.compare(Password, user1.Password);

    if (!isMatch) {
      return res.status(400).send('Invalid Password');
    }


    if(user1.isProfileComplete==false)
      return res.redirect('user_edit_profile.html');  // Redirect the worker to the edit profile page
      else   {
        const user_email=user1.Email;
        const data=await User_data.findOne({email:user_email});
        req.session.user_email=user_email;
        res.redirect('/User_Dashboard');
        
      // Use an actual route for the worker edit profile
      }
    // Redirect the user to the user homepage
    //redirect method just need the file name and sendfile method require the url so we can use path.join method
   // return res.redirect('homepage.html');  // Use an actual route for the user homepage

  } else if (role === 'worker') {
    const worker1 = await worker.findOne({ Email });

    if (!worker1) {
      return res.status(400).send('Worker Not Registered');
    }

    const isMatch = await bcrypt.compare(Password, worker1.Password);

    if (!isMatch) {
      return res.status(400).send('Invalid Password');
    }
    
    if(worker1.isProfileComplete==false)
    return res.redirect('edit_profile.html');  // Redirect the worker to the edit profile page
    else   {
      const worker_email=worker1.Email;
      const data=await Worker_data.findOne({email:worker_email});
      req.session.worker_email=worker_email;
      res.redirect('/Worker_Dashboard');
      
    // Use an actual route for the worker edit profile
    }
  } else {
    return res.status(400).send('Invalid role');
  }
});

module.exports = loginRouter;
