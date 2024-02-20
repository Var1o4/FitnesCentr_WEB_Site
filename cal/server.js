const express = require ('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride=require('method-override');
const bodyParser = require('body-parser');
const newsRoutes = require ('./routes/news-routes');
const buyRoutes = require ('./routes/buy-routes');
const accountRoutes = require ('./routes/accounts-routes');
const createPath=require('./helpers/create-path');


const Comment=require('./models/comment');
const Message=require('./models/mesages');
const { create } = require('./models/new');




const app=express();

const PORT = 3000;
const db ='mongodb+srv://kovalevicartefat:koval1008@cluster0.pzwczpc.mongodb.net/?retryWrites=true&w=majority';

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use( express.static( "public" ) );
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/public'));


mongoose 
  .connect(db, {useNewUrlParser : true, useUnifiedTopology: true})
  .then((res) => console.log('Connect to DB'))
  .catch((error) => console.log(error));


app.set('view engine', 'ejs');
app.listen(PORT, (error) => {
  error ? console.log(error) : console.log('Server listening on : http://localhost:'+PORT);
  });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(express.urlencoded({extended: false}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(buyRoutes);

app.use(newsRoutes);

app.use(accountRoutes);

app.use(express.static('styles'));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(methodOverride('_method'));



app.get('/', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  let messages=req.session.messages;
  if(!user)
  {
  res.redirect('/login');
  }
  res.render(createPath('index.ejs'), {user ,messages, role });
});

app.get('/message', (req, res) => {
  let user_s = req.session.user;
  let role = user_s ? user_s.role : 'energy';

  Message.find()
    .then((messages) => res.render(createPath('msage.ejs'), { messages, role }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'), { title: 'Error', role });
    });
});


app.post('/message', (req, res) => {
  
  let user_s = req.session.user;
  let role = user_s ? user_s.role : 'energy';

  const { text } = req.body;
  const user = user_s.login;
 const  sender=role; 
  // Найти существующее сообщение для данного пользователя
  Message.findOne({ user })
  .then(message => {
    req.session.messages = []; // Очищаем массив сообщений в сессии
    if (message) {
      // Если сообщение существует, добавляем новое сообщение в массив
      message.text.push({ sender, content: text });
      return message.save();
    } else {
      // Если сообщение не существует, создаем новое сообщение
      const newMessage = new Message({ user, text: [{ sender, content: text }] });
      return newMessage.save();
    }
  })
  .then((savedMessage) => {
    if (req.session.messages) {
      // Если переменная req.session.messages уже существует
      req.session.messages.push(savedMessage);
    } else {
      // Если переменная req.session.messages не существует, создать новый массив с сообщением
      req.session.messages = [savedMessage];
    }
console.log('nen');
    req.session.save(); // Обновление данных сессии
    res.redirect(req.headers.referer); // Редирект на предыдущую страницу
  })
  .catch(err => {
    console.error('Error saving message:', err);
    res.status(500).send('Internal Server Error');
  });
});


app.get('/message/:user_login', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  const userLogin = req.params.user_login;

  Message.find({ user: userLogin })
    .then((messages) => res.render(createPath('mesage_user.ejs'), {user,  title: 'Title', messages, role }))
    .catch((error) => {
      console.error('Error retrieving messages:', error);
      res.status(500).send('Internal Server Error');
    });
});




app.get('/serv', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  const userLogin = req.params.user_login;
 res.render(createPath('services.ejs'), {role});
});




app.post('/message/:user_login', (req, res) => {
  let user_s = req.session.user;
  let role = user_s ? user_s.role : 'energy';
  const user = user_s.login;
  const sender = role;
  const userLogin = req.params.user_login;
  const text = req.body.text;

  Message.findOne({ user: userLogin })
    .then(message => {
      if (message) {
        // Если сообщение существует, добавить новое сообщение в массив
        message.text.push({ sender, content: text });
        return message.save();
      } else {
        // Если сообщение не существует, создать новое сообщение
        const newMessage = new Message({ user: userLogin, text: [{ sender, content: text }] });
        return newMessage.save();
      }
    })
    .then(() => {
      res.redirect('/message/' + userLogin);
    })
    .catch(err => {
      console.error('Error saving message:', err);
      res.status(500).send('Internal Server Error');
    });
});













app.get('/table', (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  let messages=req.session.messages;

  console.log(role);
  res.render(createPath('table.ejs'), {messages, role });
});


    app.post('/comment', (req,res) => 
    {
      let user = req.session.user;
      let author= user.login;
      let role = user ? user.role : 'energy';
      const {text, mark}=req.body;
      const comment =new Comment( {text, author, mark} ); 
      comment
        .save()
        .then((result) => res.redirect('/comment'))
        .catch((error)=>{
        console.log(error);
        res.render(createPath('error.ejs'),{title:Error, role})
        })
    });

    
    app.get('/comment', (req,res) => {
        let user = req.session.user;
        let role = user ? user.role : 'energy';
        Comment
        .find()
        .sort({ createdAt : -1 })
        .then((comment) => res.render(createPath('comment.ejs'), {user ,comment, role}))
        .catch((error) => {
        console.log(error);
        res.render(createPath('error.ejs'),{title:'Error', role});
        });
      });


  
    app.get('/admin', (req,res) => {
      const user = req.session.user ;
      const role = user.role;
      res.render(createPath('admin.ejs'), {user, role});
      }
      );

app.use((req,res) =>
{
  res
  .status(404)
  .render(createPath('error.ejs'));
});


