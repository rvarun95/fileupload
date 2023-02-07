const mongoose = require('mongoose');
const dotenv = require('dotenv');
// mongoose.connect('mongodb://127.0.0.1:27017/file_upload');

dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Connected to MongoDB: Successful.");
    }).catch((err) => {
        console.log(err);
    });