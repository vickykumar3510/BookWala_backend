const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    bookName: String,
    bookImage: String,
    bookDescription: String,
    bookGenre: {
        type: [String],
        enum: ['Fantasy', 'Mystery', 'Thriller', 'Non-Fiction', 'History', 'Romance', 'Fiction', 'Science Fiction', 'Biography', 'Children']
    },
    bookRating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    bookAuthor: String,
    bookPrice: Number
}, {
    timestamps: true
})


const Book = mongoose.model('Book', bookSchema)
module.exports = Book