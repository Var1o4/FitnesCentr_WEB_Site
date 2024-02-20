const createPath=require('../helpers/create-path');
const Neuw=require('../models/new');

const handleError=(res, error)=>{
  console.log(error);
  res.render(createPath('error.ejs'),{title:'Error', role});
  
}

const getNew=(req,res)=>{
  let user = req.session.user;
  let role = user ? user.role : 'energy';
    const title ='Title';
    Neuw
    .findById(req.params.id)
    .then((news) => res.render(createPath('new.ejs'), {news, title, role}))
    .catch((error) => handleError(res,error));
};


const getNews=(req,res)=>{

  const title = 'News';
    let user = req.session.user;
  
    let role = user ? user.role : 'energy';
    let messages=req.session.messages;
    Neuw
    .find()
    .sort({ createdAt : -1 })
    .then((news) => res.render(createPath('news.ejs'), {messages, news, title, role}))
    .catch((error) => handleError(res,error));
};

const getAdd = (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  res.render(createPath('add-news.ejs'), { role });
};


const addNews=(req,res)=>{
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  const {tit, author, text}=req.body;
  const neuw =new Neuw({tit, author, text}); 
  neuw
    .save()
    .then((result) => res.redirect('/news'))
    .catch((error) => handleError(res,error));
 
};

const deleteNews=(req,res)=>{
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  const title ='Title';
  Neuw
  .findByIdAndDelete(req.params.id)
  .then((result) => {
  res.sendStatus(200);
  })
  .catch((error) => handleError(res,error));
};



module.exports={
getNew,
getNews,
deleteNews,
addNews,
getAdd,
};