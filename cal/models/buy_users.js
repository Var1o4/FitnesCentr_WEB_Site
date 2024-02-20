const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyShema = new Schema({
  user_login:{
  type: String,
  },
  toname:{
  type: String,
  },
  cupon_name:{
  type:String,
  },
  time_end:
  {
  type: String,
  },
},{timestamps: true});

const Buy= mongoose.model('Buy', buyShema);

module.exports=Buy;