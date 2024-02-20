const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsShema = new Schema({
  text:{
  type: String,
  },
  tit:{
  type: String,
  },
  author:{
  type: String,
  },

},{timestamps: true});

const Neuw= mongoose.model('Neuw', newsShema);

module.exports=Neuw;