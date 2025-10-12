const express=require('express');
const bodyParser=require('body-parser');
const multer=require('multer');
const {CloudinaryStorage}=require('multer-storage-cloudinary');
const cloudinary=require('cloudinary').v2;
const path = require("path");
const User_edit_proile = express.Router();
const {user, worker,Worker_data,User_data } = require('../mongodb');

// Middleware
User_edit_proile.use(bodyParser.json());
User_edit_proile.use(bodyParser.urlencoded({ extended: true }));


//configure cloudinary 
cloudinary.config({
cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
api_key:process.env.CLOUDINARY_API_KEY,
api_secret:process.env.CLOUDINARY_API_SECRET
});

const Storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
    folder: 'user_profiles',
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'ico', 'svg']
    },
});


const upload = multer({ storage: Storage }); 


// Handle form submission with image uploads
User_edit_proile.post('/', upload.fields([
    { name: 'picture', maxCount: 1 }
]), async (req, res) => {
    try {
        // Extract form data
        const { fullname, email, contact, othercontact, gender, address, city, state, landmark, pincode} = req.body;
        
         let picturePath='';
        if(gender=='Male'){
        picturePath = req.files['picture'] ? req.files['picture'][0].path : 'https://res.cloudinary.com/duximb0lu/image/upload/v1760249605/Male_Profile_yjarsm.jpg';
        }else{
        picturePath = req.files['picture'] ? req.files['picture'][0].path : 'https://res.cloudinary.com/duximb0lu/image/upload/v1760249617/Female-Profile_se2wjy.jpg';
        }

        // Create a new user document
        const newUser = new User_data({
            fullname,
            email,
            contact,
            othercontact,
            gender,
            address,
            city,
            state,
            landmark,
            pincode,
            picture: picturePath // Store file path for profile picture
        });

        // Save the user document to the database
        await newUser.save();
        console.log('User data saved succesfully');
         //setting profile status to true after editing the worker dashboard
        const user_edit_proile_flag = await user.findOne({ Email:email });
         await user_edit_proile_flag.updateOne({$set:{isProfileComplete:true}});
         console.log("Profile completion status updated to true.");
        res.render('user_dashboard', { user: newUser });


    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving data: " + err.message);
    }
});


// Serve the form HTML file
User_edit_proile.get('/', (req, res) => {

    console.log("inside the call")
    res.sendFile(path.join(__dirname, '../views/user_edit_profile.html'));   
});




module.exports = User_edit_proile;
