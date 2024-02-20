const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userShema = new Schema({
  login:{
  type: String,
  },
  password:{
  type: String,
  },
  role:{
    type: String,
    },
},{timestamps: true});

const User = mongoose.model('User', userShema);

module.exports=User;