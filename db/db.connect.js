const mongoose = require('mongoose')
require('dotenv').config()

const mongoUri = process.env.MONGODB

const connectDB = async () => {
    try {
        await mongoose
        .connect(mongoUri)
        console.log('Connected to datatbase')

    }catch(error){
        console.log('Failed to connect to database')
    }
}

module.exports = { connectDB }