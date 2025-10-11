const express = require('express');
const worker_dashboard_route = express.Router();
const path = require('path');
const { user, worker,Worker_data,User_data} = require('../mongodb');
const bodyParser = require("body-parser");


worker_dashboard_route.get('/', async(req, res) => {
  const worker_email =await req.session.worker_email;
  const worker=await Worker_data.findOne({email:worker_email});
  //worker.pictureBasename = path.basename(worker.picture);
    req.session.worker = {
    fullname: worker.username,
    email: worker.email,
    picture: worker.picture || null,
  };
  res.render('worker_main_page', { worker });
});


worker_dashboard_route.post('/', async (req,res)=>{
   const worker_email =await  req.session.worker_email;
   const worker=await Worker_data.findOne({email:worker_email});
  //if (!worker) return res.redirect('/login'); // optional auth check
  res.render('worker_dashboard', { worker:worker });

});

module.exports = worker_dashboard_route;

