const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String, 
        required: true
    },
    userEmail: {
        type: String, 
        required: true
    },
    userPassword: {
        type: String, 
        required: true
    },
    userPhoneNumber: {
        type: Number, 
        required: true
    }
},{
    timestamps: true
})

const User = mongoose.model('user', userSchema)
module.exports = User