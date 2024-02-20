const { Double } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mesageShema = new Schema({
  sender: String,
  text: Array,
  createdAt: Array
});

const Mesage= mongoose.model('Mesage', mesageShema);

module.exports=Mesage;