const mongoose = require('mongoose');
require('dotenv').config(); // Assuming you use dotenv to manage MONGODB_URI



// --- 2. Define Nested Schemas (for Worker/User Data History, Notifications, Orders) ---
const userNotificationSchema = new mongoose.Schema({
    workerEmail: {
        type: String,
        required: true
    },
    notificationId: {
        type: String, 
        required: true
    },
    worker_name: {
        type: String,
        required: true
    },
    worker_pending_work: {
        type: Number, 
        default: 0
    },
    typeofservice: {
        type: String,
        required: true
    },
    timeofservice: {
        type: String,
        required: true
    },
    dateofservice: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['received', 'confirmed', 'rejected', 'completed'], 
        default: 'received'
    },
    picture: {
        type: String,
        required: true
    }
}); 

const workerNotificationSchema = new mongoose.Schema({
    clientEmail: {
        type: String,
        required: true
    },
    notificationId: {
        type: String, // Must match the ID used in the user notification
        required: true
    },
    clientname: {
        type: String,
        required: true
    },
    typeofservice: {
        type: String,
        required: true
    },
    timeofservice: {
        type: String,
        required: true
    },
    dateofservice: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    }
}); 


const workerOrderSchema = new mongoose.Schema({
    orderId: {
        type: String, 
        required: true,
        unique: true 
    },
    notificationId: {
        type: String,
        required: true 
    },
    clientEmail: {
        type: String,
        required: true
    },
    clientname: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    typeofservice: {
        type: String,
        required: true
    },
    timeofservice: {
        type: String,
        required: true
    },
    dateofservice: {
        type: String,
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'started', 'completed', 'cancelled'], 
        default: 'pending'
    },
    start_otp: {
        type: String,
        required: true 
    },
    end_otp: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true // URL to the client's picture
    }
}); 


const userBookingSchema = new mongoose.Schema({
    bookingId: {
        type: String, 
        required: true,
        unique: true
    },
    notificationId: {
        type: String,
        required: true
    },
    workerEmail: {
        type: String,
        required: true
    },
    workername: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true 
    },
    typeofservice: {
        type: String,
        required: true
    },
    timeofservice: {
        type: String,
        required: true
    },
    dateofservice: {
        type: String,
        required: true 
    },
    start_otp: {
        type: String,
        required: true
    },
    end_otp: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'started', 'completed', 'cancelled'],
        default: 'confirmed' 
    }
}); 


const WorkerHistorySchema = new mongoose.Schema({
    clientname: {
        type: String,
        required: true
    },
    issue_name: {
        type: String,
        required: true
    },
    totaltimeofservice: {
        type: String,
        required: true 
    },
    dateofservice: {
        type: String,
        required: true 
    },
    status: {
        type: String,
        enum: ['completed', 'cancelled'], 
    },
    price: {
        type: String,
        required: true 
    },
    picture: {
        type: String,
        required: true 
    }
}); 

const userHistorySchema = new mongoose.Schema({
    worker_name: {
        type: String,
        required: true
    },
    issue_name: {
        type: String,
        required: true
    },
    totaltimeofservice: {
        type: String,
        required: true // Format like "HH : MM : SS"
    },
    dateofservice: {
        type: String,
        required: true // Consider using Date type for better query capabilities
    },
    price: {
        type: String,
        required: true // Tracks the final charge
    },
    picture: {
        type: String,
        required: true // URL to the worker's picture
    }
});

// --- 3. Define Main Schemas ---

// A. Base Schema for Worker & User Login (The one you provided)
const baseSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    }
});


// B. Worker Profile Data Schema (The long one you provided)
const worker_profile_data_schema = new mongoose.Schema({
    firstname: { type: String, required: true },
    middlename: { type: String, required: true },
    surname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    // Work and Education Details
    work_type: { type: String, required: true },
    about: { type: String, required: true },
    experience: { type: Number, required: true },
    qualification: { type: String, required: true },
    // Booking Details
    shift: { type: String, enum: ['Day', 'Night', 'Both'], required: true },
    city: { type: String, required: true },
    landmark: { type: String, required: true },
    pincode: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    location: { type: String, required: true },
    // Image file paths
    picture: { type: String, required: true },
    aadhar: { type: String, required: true },
    // Nested Arrays
    notification: [{ type: workerNotificationSchema, default: [] }],
    order: [{ type: workerOrderSchema, default: [] }],
    history: [{ type: WorkerHistorySchema, default: [] }],
    isActive: { type: Boolean, default: true }
});


// C. User Data Schema (Inferred from your user_data JSON)
const user_data_schema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    othercontact: { type: String },
    gender: { type: String, enum: ['Male', 'Female'] },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    landmark: { type: String },
    pincode: { type: String },
    picture: { type: String, required: true },
    // Nested Arrays (Assuming similar structure to worker_profile)
    notification: [{ type: userNotificationSchema, default: [] }],
    bookings: [{ type: userBookingSchema, default: [] }], // Inferred from "bookings" in User_data section of your login.js
    history: [{ type: userHistorySchema, default: [] }],
    isActive: { type: Boolean, default: true }
});


// --- 4. Create Models ---

// NOTE: I am using **Capitalized** names for the models.
// You must import them as `{ User, Worker, Worker_data, User_data }` in login.js
const user = mongoose.model('User', baseSchema);
const worker = mongoose.model('Worker', baseSchema); // Assuming worker login uses the same baseSchema

const Worker_data = mongoose.model('Worker_data', worker_profile_data_schema);
const User_data = mongoose.model('User_data', user_data_schema);


// --- 5. Export All Models ---

module.exports = {
    user,           // Corresponds to 'user' in your login.js logic (login/password/isProfileComplete)
    worker,         // Corresponds to 'worker' in your login.js logic (login/password/isProfileComplete)
    Worker_data,    // Corresponds to 'Worker_data' in your login.js logic (full profile)
    User_data       // Corresponds to 'User_data' in your login.js logic (full profile)
};