const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  startingPrice: {
    type: Number,
    required: true,
  },
  auctionEnd: Date,
});

const Item = mongoose.model('Item', ItemSchema); // ← Correct here

module.exports = Item;
