const mongoose = require('mongoose');
const dotenv = require('dotenv');
// mongoose.connect('mongodb://127.0.0.1:27017/file_upload');

dotenv.config();
// mongoose.connect("mongodb+srv://rvarun95:mongodb@rvarun95.cfs5l7x.mongodb.net/file_upload?retryWrites=true&w=majority")
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("DB Connection Successful.");
    }).catch((err) => {
        console.log(err);
    });