const mongoose = require('mongoose');
require('dotenv').config();

const URL = process.env.DATABASE


const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log('connected to database');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;