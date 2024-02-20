const { Double } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cuponShema = new Schema({
  name:{
  type: String,
  },
  text:{
  type: String,
  },
  price:{
  type:Number,
  },
  contin:{
    type:Number,
    },
});

const Cupon= mongoose.model('Cupon', cuponShema);

module.exports=Cupon;