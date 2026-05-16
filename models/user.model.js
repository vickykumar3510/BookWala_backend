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
    },
    cart: [{
        bookName: String,
        bookImage: String,
        bookDescription: String,
        bookRating: Number,
        quantity: { type: Number, default: 1 }
    }],
    wishlist: [{
        bookName: String,
        bookImage: String,
        bookDescription: String,
        bookRating: Number
    }],
    addresses: [{
        flat: String,
        area: String,
        landmark: String,
        city: String,
        state: String,
        pincode: Number
    }]
},{
    timestamps: true
})

const User = mongoose.model('user', userSchema)
module.exports = User