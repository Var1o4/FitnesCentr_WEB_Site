const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentShema = new Schema({
  text:{
  type: String,
  },
  author:{
  type: String,
  },
  mark:{
  type:String,
  },
},{timestamps: true});

const Comment= mongoose.model('Comment', commentShema);

module.exports=Comment;