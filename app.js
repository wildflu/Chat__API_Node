const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wilchaine', { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define the schema for your data
const bookSchema = new mongoose.Schema({
  time: { type: String, required: true },
  chat: [{ text: String, qs: Boolean }]
});

// Define the model for your data
const Book = mongoose.model('Book', bookSchema, 'Iachat');

// Define your API routes
app.get('/api/iachat', async (req, res) => {
  try {
    const iachat = await Book.find();
    res.send(iachat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/iachat', async (req, res) => {
  try {
    const book = new Book({
      time: req.body.time,
      chat: req.body.chat
    });
    await book.save();
    res.send(book._id);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/iachat/:id/chat', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('Book not found');

    book.chat.push({
      text: req.body.text,
      qs: req.body.qs
    });
    await book.save();

    res.send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/iachat/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// delete 
app.delete('/api/iachat/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.send(book);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
















// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
