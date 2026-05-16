const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    customerName: String,
    customerAddress:  {
      flat: String,
      area: String,
      landmark: String,
      city: String,
      state: String,
      pincode: Number
    },
    customerPhone: {
      type: String,
      match: /^[0-9]{10}$/
    },
    totalBooks: Number,
    totalPrice: Number,
    items: [
       { 
        bookName: String,
        bookImage: String,
        bookDescription: String,
        bookRating: Number,
        quantity: {type: Number, default: 1}
    }
    ]
},
{
timestamps: true})

const Order = mongoose.model('order', orderSchema)
module.exports = Order