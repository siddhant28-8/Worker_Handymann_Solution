const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require("path");
const edit_profile = express.Router();
const {user, worker,Worker_data,User_data } = require('../mongodb');


// Middleware
edit_profile.use(bodyParser.json());
edit_profile.use(bodyParser.urlencoded({ extended: true }));


/*
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

*/
//Configure cloudinary 

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const Storage=new CloudinaryStorage({
cloudinary:cloudinary,
params:{
    folder: 'worker_profiles',
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'ico', 'svg']
  },
});

const upload = multer({ storage: Storage });


// Handle form submission with image uploads
edit_profile.post('/', upload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'aadhar', maxCount: 1 }
]), async (req, res) => {
    try {
        // Extract form data
        const { firstname,middlename,surname,username, email, contact, age, gender, work_type, about, experience, qualification, shift, city,landmark ,pincode ,state ,district , location } = req.body;
        
        
        // Get file paths from the request (uploaded images)
        const picturePath = req.files['picture'] ? req.files['picture'][0].path : null;
        const aadharPath = req.files['aadhar'] ? req.files['aadhar'][0].path : null;

        // Create a new user document
        const newUser = new Worker_data({
            firstname,
            middlename,
            surname,
            username,
            email,
            contact,
            age,
            gender,
            work_type,
            about,
            experience,
            qualification,
            shift,
            city,
            landmark,
            pincode,
            district,
            state,
            location,
            picture: picturePath, // Store file path for profile picture
            aadhar: aadharPath  // Store file path for Aadhar image
        });

        // Save the user document to the database
        await newUser.save();
        console.log("Worker data saved");
         //setting profile status to true after editing the worker dashboard
        const edit_profile_flag = await worker.findOne({ Email:email });
         await edit_profile_flag.updateOne({$set:{isProfileComplete:true}});
         console.log("Profile completion status updated to true.");
         newUser.pictureBasename = path.basename(newUser.picture);
        res.render('worker_main_page', { worker: newUser });


    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving data: " + err.message);
    }
});

/*
// Serve uploaded images via static route
edit_profile.use('/uploads', express.static(path.join(__dirname, 'my_uploads')));
*/


// Serve the form HTML file
edit_profile.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'edit_profile.html'));   
});


/*
// Route to display user images
app.get("/users/:id", async (req, res) => {
    try {
        const user = await Store.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Display images using the file paths stored in MongoDB
        res.send(`
            <h1>${user.name}</h1>
            <p>Email: ${user.email}</p>
            <img src="/uploads/${path.basename(user.image)}" alt="Profile Image" style="max-width: 300px;"/>
            <img src="/uploads/${path.basename(user.aadhar)}" alt="Aadhaar Image" style="max-width: 300px;"/>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

*/

module.exports = edit_profile;
