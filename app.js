const express = require('express');
const path =require('path');
const session = require('express-session');
const MongoStore = require("connect-mongo");
require('dotenv').config();
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "siddhant8989xyz2808rai98rakesh", // replace with a strong secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // your Atlas URI
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax" // HTTPS only in production
    },
  })
);

//routes
const registerRoute = require('./routes/register.js');
const signinRoute=require('./routes/login.js');
const book_service_route=require('./routes/book_services.js');
const confirm_service_route = require('./routes/confirm_service');
const edit_profile_route =require('./routes/img_store.js');
const edit_profile_ejs=require('./routes/edit_profile_ejs.js');
const User_edit_profile=require('./routes/user_edit_profile.js');
const user_dashboard_route=require('./routes/user_dashboard.js');
const worker_dashboard_route=require('./routes/worker_dashboard.js');
const add_notification_route=require('./routes/Add_Notification.js');
const user_notification_route=require('./routes/user_notification.js');
const worker_notification_route=require('./routes/worker_notification.js');
const add_bookings_route=require('./routes/Add_Bookings.js');
const worker_order_route=require('./routes/worker_orders.js');
const user_booking_route=require('./routes/user_booking.js');
const user_history_route=require('./routes/user_history.js');
const worker_history_route=require('./routes/worker_history.js');
const otp_route=require('./routes/Add_Otp.js');

const {user,worker,Worker_data,User_data}=require('./mongodb.js')



//connection to database 
const connectDB = require("./connection.js");  
connectDB();

//middleware for form data handling
const bodyParser = require('body-parser');

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set the folder where your views (ejs templates) are located
app.set('views', path.join(__dirname, 'views'));


// Serve static files from the 'views' directory
app.use(express.static('views'));
app.use('/my_uploads', express.static(path.join(__dirname, 'my_uploads')));
app.use('/user_data', express.static(path.join(__dirname, 'user_data')));
app.use(bodyParser.urlencoded({ extended: true }));  //express middleware for handling post request
app.use(bodyParser.json());

// Middleware to make session available in EJS
app.use((req, res, next) => {
  // Set both session variables as local variables for the templates
  res.locals.user = req.session.user || null;
  res.locals.worker = req.session.worker || null;
  
  // Continue to the next middleware or route handler
  next();
});


// Route for homepage or other pages
app.get('/', (req, res) => {
  res.render('homepage');
});


app.use('/signup', registerRoute);                 // handling registeration post and get
app.use('/signin', signinRoute);                 // handling login post and get
app.use('/edit-profile',edit_profile_route);
app.use('/profile',edit_profile_ejs);
app.use('/complete_profile',User_edit_profile);
app.use('/book_services', book_service_route);   
app.use('/confirm_service', confirm_service_route);
app.use('/User_Dashboard', user_dashboard_route);
app.use('/Worker_Dashboard', worker_dashboard_route);
app.use('/add_notification', add_notification_route);
app.use('/user_notification', user_notification_route);
app.use('/Worker_notification', worker_notification_route);
app.use('/add_bookings',add_bookings_route );
app.use('/Worker_order', worker_order_route);
app.use('/user_bookings',user_booking_route );
app.use('/user_history',user_history_route );
app.use('/worker_history',worker_history_route );
app.use('/Work_In_Progress',otp_route );
app.get('/About',(req,res)=>{
  res.render('about');
});
app.get('/Contact',(req,res)=>{
  res.render('contact');
});
app.get('/Pricing',(req,res)=>{
  res.render('pricing');
});
app.get('/Faq',(req,res)=>{
  res.render('faqs');
});
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log("Logout Error:", err);
    }

    // Prevent caching of any previously visited pages
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Redirect to homepage (or login)
    res.redirect('/');
  });
});

// Backend (Node.js example)
app.post('/update-status', async (req, res) => {
  const { Email, status } = req.body;
  try {
    const worker1 = await Worker_data.findOne({email:Email}); // Assuming Worker is a MongoDB model
    worker1.isActive = !status; // Update the status field
    await worker1.save();
    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
});





const PORT=process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
