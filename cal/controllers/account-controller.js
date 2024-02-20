const createPath=require('../helpers/create-path');
const bcrypt= require('bcryptjs');
const User=require('../models/user');
const Message=require('../models/mesages');


const getEdit = (req,res) => { 
  let user = req.session.user;
  let role = user ? user.role : 'energy';
 const title ='Title';
 User
 .findById(req.params.id)
 .then((user_all) => res.render(createPath('edit_user.ejs'), {user_all, title, role}))
 .catch((error) => {
 console.log(error);
 res.render(createPath('error.ejs'),{title:'Error', role});
 });
};


const putEdit=(req,res)=>{
  const {login, role, password}=req.body;
    const {id} = req.params;

      User
      .findByIdAndUpdate(id,{login, role, password})
      .then(result => res.redirect('/work-whith-account'))
      .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'),{title:'Error'});
      });
 
};

const wwaGet=(req,res)=>{
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  User
  .find()
  .sort({ createdAt : -1 })
  .then((user_all) => res.render(createPath('work-whith-account.ejs'), {user_all, role}))
  .catch((error) => {
  console.log(error);
  res.render(createPath('error.ejs'),{title:'Error'});
  });
 
};

const find_resultGet= async (req,res)=>{
  const login = req.query.login;
      let user = req.session.user;
      let role = user ? user.role : 'energy';
    
      // Поиск пользователя по логину в базе данных
      const user_ass  = await User.findOne({ login });
      if(user_ass){
        res.render(createPath('find-result.ejs'), { user_ass , role});
      }
      else { 
        User
      .find()
      .sort({ createdAt : -1 })
      .then((user_all) => res.render(createPath('work-whith-account.ejs'), {user_all, role}))
      .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'),{title:'Error'});
      });
      }
};

const wwaDelete=(req,res)=>{
  let user = req.session.user;
      let role = user ? user.role : 'energy';
      const title ='Title';
      User
      .findByIdAndDelete(req.params.id)
      .then((result) => {
      res.sendStatus(200);
      })
      .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'),{title:'Error', role});
      });
};

const wwaPost= async (req,res)=>{
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  try {
    const { login } = req.body;
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }
    res.render('popup', { user , role});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Ошибка на сервере' });
  }
};

const registerGet=(req,res)=>{
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  res.render(createPath('register.ejs', {role}));
};

const registerPost=async (req, res) => {
  
  const { login, password, passwordConfirm } = req.body;
  const role='energy';
  // Проверка, что пароль и его подтверждение совпадают
  if (password !== passwordConfirm) {
    return res.status(400).send('Пароли не совпадают');
  }
  
  try {
    // Проверяем, есть ли уже пользователь с таким логином в базе данных
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).send('Пользователь с таким логином уже существует');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ login, password: hashedPassword, role });
    await newUser.save();

    // Перенаправляем пользователя на страницу входа
   
    res.redirect('/login');
  } catch (error) {
    console.log(error);
    res.status(500).send('Произошла ошибка при регистрации пользователя');
  }
 
};

const loginGet=(req,res)=>{
  res.render(createPath('login.ejs')); // Отображаем страницу авторизации
};
const loginPost = async (req, res) => {
  const { login, password } = req.body;

  try {
    // Проверяем, есть ли уже пользователь с таким логином в базе данных
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
      if (isPasswordMatch) {
        let role = existingUser.role;
        req.session.user = { login: existingUser.login, role: existingUser.role };
        let userLogin = existingUser.login;

        // Поиск сообщений пользователя
        Message.find({ user: userLogin })
          .then((messages) => {
            if (messages && messages.length > 0) {
              // Если сообщения существуют, добавляем их в сессию
              req.session.messages = messages;
            } else {
              // Если сообщений нет, создаем новое сообщение и сохраняем его в базе данных
              const newMessage = new Message({ user: userLogin, text: [{ sender: existingUser.role , content: 'Вы зарегистрировались.' }] });
              req.session.messages = [newMessage]; // Записываем новое сообщение в сессию
              newMessage.save(); // Сохраняем новое сообщение в базе данных
            }
            console.log(req.session.messages);
            res.redirect('/');
          })
          .catch((error) => {
            console.log(error);
            res.render(createPath('error.ejs'), { title: 'Error', role });
          });
          } else {
          res.status(500).send('Неправильный пароль');
          }
          } else {
          res.status(500).send('Пользователь не найден');
          }
          } catch (error) {
          console.log(error);
          res.status(500).send('Произошла ошибка при регистрации пользователя');
          }
          };







module.exports={
getEdit,
putEdit,
wwaGet,
find_resultGet,
wwaDelete,
wwaPost,
registerGet,
registerPost,
loginGet,
loginPost,
  };