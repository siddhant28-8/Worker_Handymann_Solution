const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const edit_profile_ejs = express.Router();
const {user, worker,Worker_data,User_data } = require('../mongodb');


// Middleware
edit_profile_ejs.use(bodyParser.json());
edit_profile_ejs.use(bodyParser.urlencoded({ extended: true }));



// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'my_uploads');  // Destination folder for upload
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// profileRouter.js (POST route for updating profile)
edit_profile_ejs.post('/edit_profile/:username', upload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 }
]), async (req, res) => {
    try {
        // Extract form data
        const { username, email, contact, age, gender, work_type, about, experience, qualification, shift, location } = req.body;
        
        UserName=req.params.username;
        // Get file paths from the request (uploaded images)
        const picturePath = req.files['picture'] ? req.files['picture'][0].path : null;
        const aadharPath = req.files['aadhar'] ? req.files['aadhar'][0].path : null;

        // Find the existing worker by username
        const existingWorker = await Worker_data.findOne({ username:UserName });

        if (existingWorker) {
            // Update the fields that are provided
            existingWorker.username = username || existingWorker.username;
            existingWorker.email = email || existingWorker.email;
            existingWorker.contact = contact || existingWorker.contact;
            existingWorker.age = age || existingWorker.age;
            existingWorker.gender = gender || existingWorker.gender;
            existingWorker.work_type = work_type || existingWorker.work_type;
            existingWorker.about = about || existingWorker.about;
            existingWorker.experience = experience || existingWorker.experience;
            existingWorker.qualification = qualification || existingWorker.qualification;
            existingWorker.shift = shift || existingWorker.shift;
            existingWorker.location = location || existingWorker.location;

            // If new pictures are provided, update the paths
            if (picturePath) 
                existingWorker.picture = picturePath;
            else 
                existingWorker.picture = existingWorker.picture;
            if (aadharPath) 
                existingWorker.aadhar = aadharPath;
            else 
            existingWorker.aadhar = existingWorker.aadhar;

            // Save the updated worker document
            await existingWorker.save();

            // Update the profile completion flag if needed
            await existingWorker.updateOne({ $set: { isProfileComplete: true } });
            console.log("Profile updated successfully");

            // Redirect or render the updated worker profile
            res.render('worker_main_page', { worker: existingWorker });

        } else {
            // Handle case where worker is not found
            res.status(404).send('Worker not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating profile: " + err.message);
    }
});      


// Serve uploaded images via static route
edit_profile_ejs.use('/uploads', express.static(path.join(__dirname, 'my_uploads')));

// Serve the form HTML file
edit_profile_ejs.get("/edit_profile/:username",async (req, res) => {
    const userName = req.params.username; // Extract username from the URL parameter
    try {
        const worker = await Worker_data.findOne({ username: userName });

        if (worker) {
            // Render the edit profile page with worker data
            res.render('edit-profile', { worker });
        } else {
            // If no worker is found, send an error or a 404 page
            res.status(404).send('Worker not found');
        }
    } catch (err) {
        // Handle potential database errors
        console.error(err);
        res.status(500).send('Internal server error');
    } 
});



module.exports = edit_profile_ejs;
