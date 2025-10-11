const express = require('express');
const user_dashboard_route = express.Router();
const path = require('path');
const { user, worker,Worker_data,User_data } = require('../mongodb');
const bodyParser = require("body-parser");


user_dashboard_route.get('/', async(req, res) => {
  const user_email = await req.session.user_email;
  const user=await User_data.findOne({email:user_email});
  req.session.user = {
    fullname: user.fullname,
    email: user.email,
    picture: user.picture || null,
  };
  res.render('user_dashboard', { user });
});

user_dashboard_route.post('/', async (req,res)=>{
   const user_email = await req.session.user_email;
   const user=await User_data.findOne({email:user_email});
  //if (!user) return res.redirect('/login'); // optional auth check
  res.render('user_dashboard', { user:user });

});

module.exports = user_dashboard_route;

