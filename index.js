const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const { connectDB } = require('./db/db.connect')
const Book = require('./models/books.model')
const Order = require('./models/orders.model')
const User = require('./models/user.model')

const app = express()
connectDB()

app.use(express.json())
app.use(cors())

const JWT_SECRET = process.env.JWT_SECRET

app.get('/', async(req, res) => {
    res.send('App is running')
})

//add a book

async function addBook(bookData){
    try {
        const newBook = new Book(bookData)
        return await newBook.save()
    }catch(error){
        throw error
    }
}

app.post('/book', async(req, res) => {
    try {
        const savedBook = await addBook(req.body)
        res.status(200).json({message: 'Book has been added', newBook: savedBook })
        
    }catch(error){
        res.status(500).json({message: 'Error while creating book', error: error.message})
    }
})

//get all the books

async function getAllBook(){
    try{
        return await Book.find()
    }catch(error){
        throw error
    }
}

app.get('/book', async(req, res) => {
    try {
        const books = await getAllBook()
        if(books.length !== 0){
            res.status(200).json(books)
        } else {
            res.status(404).json({error: 'Error while fetching the books'})
        }
    }catch(error){
        res.status(500).json({message: 'Error while fetching books', error: error.message})
    }
})

//get book by genre

async function getBookByGenre(byGenre){
    try {
        return await Book.find({bookGenre: byGenre})
    }catch(error){
        throw error
    }
}

app.get('/book/bookGenre/:byGenre', async(req, res) => {
    try {
        const books = await getBookByGenre(req.params.byGenre)
        if(books.length !== 0){
            res.status(200).json(books)
        } else {
            res.status(404).json({error: 'No book found'})
        }
    }catch(error){
        res.status(500).json({message: 'Error while fetching book', error: error.message})
    }
})

//get book by book name

async function getBookByBookName(byBookName){
    try{
        return await Book.find({bookName: byBookName})
    }catch(error){
        throw error
    }
}

app.get('/book/bookName/:byBookName', async(req, res) => {
    try {
        const books = await getBookByBookName(req.params.byBookName)
        if(books.length !== 0){
            res.status(200).json(books)
        } else {
            res.status(404).json({message: 'No book found'})
        }
        
    }catch(error){
        res.status(500).json({error: 'Failed to fetch books', error: error.message})
    }
})

//get book by author

async function getBookByAuthor(byAuthor){
    try{
        return await Book.find({bookAuthor: byAuthor})
    }catch(error){
        throw error
    }
}

app.get('/book/bookAuthor/:byAuthor', async(req, res) => {
    try {
        const books = await getBookByAuthor(req.params.byAuthor)
        if(books.length !== 0){
            res.status(200).json(books)
        } else {
            res.status(404).json({message: 'No book found'})
        }
    }catch(error){
        res.status(500).json({message: 'Failed to fetch book.', error: error.message})
    }
})

//get book by rating

async function getBookByRating(byRating){
    try{
        return await Book.find({bookRating: byRating})
    }catch(error){
        throw error
    }
}

app.get('/book/bookRating/:byRating', async(req, res) => {
    try{
        const books = await getBookByRating(req.params.byRating)
        if(books.length !== 0){
            res.status(200).json(books)
        } else {
            res.status(404).json({message: 'No book found.'})
        }
        
    }catch(error){
        res.status(500).json({message: 'Error while fetching the books', error: error.message})
    }
})

//update book by id

async function updateBookById(id, updateData){
    try {
        return await Book.findByIdAndUpdate(id, updateData, {returnDocument: 'after', runValidators: true })
    }catch(error){
        throw error
    }
}

app.put('/book/:id', async(req, res) => {
    try{
        const updatedBook = await updateBookById(req.params.id, req.body)
        if(updatedBook){
            res.status(200).json({message: 'Book updated successfully', item:updatedBook})
        } else {
            res.status(404).json({message: 'Book not found'})
        }

    }catch(error){
        res.status(500).json({message: 'Failed to update book', error: error.message})
    }
})

//delete book by id

async function deleteBookById(id){
    try{
        return await Book.findByIdAndDelete(id)
    }catch(error){
        throw error
    }
}

app.delete('/book/:id', async(req, res) => {
    try{
        const deleteBook = await deleteBookById(req.params.id)
        if(deleteBook){
            res.status(200).json({message: 'Book has been deleted'})
        } else {
            res.status(404).json({message: 'Book not found.'})
        }

    }catch(error){
        res.status(500).json({message: 'Failed to delete book', error: error.message})
    }
})

//AUTH

//for adding new user signup

app.post('/auth/signUp', async(req, res) => {
    try{
        const {userName, userEmail, userPassword, userPhoneNumber} = req.body
        const hashedPassword = await bcrypt.hash(userPassword, 10)
        const user = new User({userName, userEmail, userPassword: hashedPassword, userPhoneNumber})
        await user.save()

        res.status(201).json({message: 'User registered successfully', user})
    }catch(error){
        res.status(500).json({error: 'Error while adding new user', details: error.message})
    }
})

//login user

app.post('/auth/login', async(req, res) => {
    try{
        const {userEmail, userPassword} = req.body
        const user = await User.findOne({userEmail})
        if(!user) return res.status(400).json({error: 'Invalid credentials'})

        const isMatch = await bcrypt.compare(userPassword, user.userPassword)
        if(!isMatch) return res.status(400).json({error: 'Invalid credentials'})

        const token = jwt.sign({id: user._id, }, JWT_SECRET, { expiresIn: '24h'})
        res.json({message: 'Login successfully', token})
    }catch(error){
        res.status(500).json({message: 'Error while login', error: error.message})
    }
})

//get all users

async function getAllUser(){
    try{
        return await User.find()
    }catch(error){
        throw error
    }
}

app.get('/user', async(req, res) => {
    try{
        const user = await getAllUser()
        if(user.length !== 0){
            res.status(200).json(user)
        } else {
            res.status(404).json({message: 'No user found.'})
        }
        
    }catch(error){
        res.status(500).json({message: 'Error while fetching the user', error: error.message})
    }
})

//delete user by id

async function deleteUserById(id){
    try{
        const user = await User.findByIdAndDelete(id)
        return user
    }catch(error){
        throw error
    }
}

app.delete('/user/:id', async(req, res) => {
    try{
        const deletedUser = await deleteUserById(req.params.id)
        if(deletedUser){
            res.status(200).json({message: 'User deleted successfully', user: deletedUser})
        } else {
            res.status(404).json({message: 'No user found.'})
        }
        
    }catch(error){
        res.status(500).json({message: 'Failed to delete user', error: error.message})
    }
})

//auth/JWT middleware

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Malformed token.' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// cart, wishlist, addresses for logged-in user only

app.get('/user/me/cart', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('cart');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user.cart || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

app.put('/user/me/cart', verifyJWT, async (req, res) => {
  try {
    const cart = Array.isArray(req.body) ? req.body : req.body.cart;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: 'Cart must be an array (or use { cart: [...] }).' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { cart } },
      { new: true, runValidators: true }
    ).select('cart');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Cart updated', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
});

app.get('/user/me/wishlist', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
});

app.put('/user/me/wishlist', verifyJWT, async (req, res) => {
  try {
    const wishlist = Array.isArray(req.body) ? req.body : req.body.wishlist;
    if (!Array.isArray(wishlist)) {
      return res.status(400).json({ message: 'Wishlist must be an array (or use { wishlist: [...] }).' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { wishlist } },
      { new: true, runValidators: true }
    ).select('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Wishlist updated', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Error updating wishlist', error: error.message });
  }
});

app.get('/user/me/addresses', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching addresses', error: error.message });
  }
});

app.post('/user/me/addresses', verifyJWT, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { addresses: req.body } },
      { new: true, runValidators: true }
    ).select('addresses');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(201).json({ message: 'Address added', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
});

app.delete('/user/me/addresses/:addressId', verifyJWT, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { addresses: { _id: req.params.addressId } } },
      { new: true }
    ).select('addresses');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'Address removed', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Error removing address', error: error.message });
  }
});

//get orders for logged-in user only

async function getOrderByUser(userId) {
  try {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
}

app.get('/order', verifyJWT, async (req, res) => {
  try {
    const order = await getOrderByUser(req.user.id);
    if (order.length !== 0) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'No order found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});


//place order

async function placeOrder(orderData, userId) {
  try {
    const newOrder = new Order({
      ...orderData,
      user: userId,
      orderDateTime: new Date(),
    });
    return await newOrder.save();
  } catch (error) {
    throw error;
  }
}

app.post('/order', verifyJWT, async (req, res) => {
  try {
    const savedOrder = await placeOrder(req.body, req.user.id);
    if (savedOrder) {
      res.status(200).json(savedOrder);
    } else {
      res.status(404).json({ message: 'No order found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error while placing order', error: error.message });
  }
});

// current logged-in user
app.get('/user/me', verifyJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-userPassword');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on the PORT ${PORT}`)
})
