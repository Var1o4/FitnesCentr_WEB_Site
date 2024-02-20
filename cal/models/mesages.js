const { Double } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mesageShema = new Schema({
  user: String,
  text: [{
    sender: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const Message= mongoose.model('Message', mesageShema);

module.exports=Message;