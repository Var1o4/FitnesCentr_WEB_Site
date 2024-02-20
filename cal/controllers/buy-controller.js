const createPath=require('../helpers/create-path');
const Buy=require('../models/buy_users');

const Cupon=require('../models/cupons');

const getCup = (req,res) => { 
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  Buy
  .find()
  .sort({ createdAt : -1 })
  .then((cupon) => res.render(createPath('chek_cup.ejs'), {cupon,user, role}))
  .catch((error) => {
  console.log(error);
  res.render(createPath('error.ejs'),{title:'Error', role});
  });
};

const cupDelete=(req,res)=>{
  let user = req.session.user;
      let role = user ? user.role : 'energy';
      const title ='Title';
      Buy
      .findByIdAndDelete(req.params.id)
      .then((result) => {
      res.sendStatus(200);
      })
      .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'),{title:'Error', role});
      });
};


const minSort = (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  let messages=req.session.messages;

  Cupon
    .find()
    .then((cupon) => {
      cupon.sort((a, b) => a.price - b.price); // Сортировка по возрастанию цены
      res.render(createPath('time.ejs'), {messages, cupon, user, role });
    })
    .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'), { title: 'Error', role });
    });
};


const maxSort = (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  let messages=req.session.messages;

  Cupon
    .find()
    .then((cupon) => {
      cupon.sort((a, b) => b.price - a.price); // Сортировка по убыванию цены
      res.render(createPath('time.ejs'), {messages, cupon, user, role });
    })
    .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'), { title: 'Error', role });
    });
};

const filter = (req, res) => {
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  let messages=req.session.messages;

  const { min_price, max_price } = req.body;
  Cupon
    .find()
    .then((cupon) => {
      cupon = cupon.filter((item) => item.price >= min_price && item.price <= max_price); // Фильтрация по цене
      cupon.sort((a, b) => b.price - a.price); // Сортировка по убыванию цены
      res.render(createPath('time.ejs'), {messages, cupon, user, role });
    })
    .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'), { title: 'Error', role });
    });
};



const getTime = (req,res) => {
  let user = req.session.user;
  let role = user ? user.role : 'energy';
  let messages=req.session.messages;

  Cupon 
  .find()
  .then((cupon) => res.render(createPath('time.ejs'), {messages,cupon,user, role}))
  .catch((error) => {
  console.log(error);
  res.render(createPath('error.ejs'),{title:'Error', role});
  });
};


const cuponPost = (req,res) => {
      const {name,text, price, contin}=req.body;
      const cupon = new Cupon({
        name: name,
        text: text,
        price: price,
        contin:contin
      });
      cupon
        .save()
        .then((result) => res.redirect('/time'))
        .catch((error)=>{
        console.log(error);
        res.render(createPath('error.ejs'))
        })
};


const cuponDelete=(req,res)=>{
  let user = req.session.user;
      let role = user ? user.role : 'energy';
      const title ='Title';
      Cupon
      .findByIdAndDelete(req.params.id)
      .then((result) => {
      res.sendStatus(200);
      })
      .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'),{title:'Error', role});
      });
};


const findCuponByName = (name) => {
  return Cupon.findOne({ name: name }).exec();
};

const timePost = async (req,res) => {
  let user = req.session.user;
      let role = user ? user.role : 'energy';
      const {toname, cupon_name}=req.body;

      try {
        const cupon = await findCuponByName(cupon_name);
        
        // Дальнейшая обработка найденного объекта Cupon
        if (cupon) {

          const currentDate = new Date();
          const formattedCurrentDate = currentDate.toISOString().slice(0, 10);
          
          // Дата через месяц
          const oneMonthLater = new Date();
          oneMonthLater.setMonth(currentDate.getMonth() + cupon.contin);
          const formattedOneMonthLater = oneMonthLater.toISOString().slice(0, 10);
            
          
      const buy_users = new Buy({
        user_login: user.login,
        toname: toname,
        cupon_name: cupon_name,
        time_end: formattedOneMonthLater
      });console.log(buy_users);
      buy_users
        .save()
        .then((result) => res.redirect('/time'))
        .catch((error)=>{
        console.log(error);
        res.render(createPath('error.ejs'),{title:Error, role})
        })


          // Ваш код обработки найденного купона
          console.log(cupon);
        } else {
          console.log('Купон не найден');
        }
      } catch (error) {
        console.error(error);
      }
};




const getCupEdit = (req,res) => { 
  let user = req.session.user;
  let role = user ? user.role : 'energy';
 const title ='Title';
 Cupon
 .findById(req.params.id)
 .then((cupon) => res.render(createPath('edit_cup.ejs'), {cupon, title, role}))
 .catch((error) => {
 console.log(error);
 res.render(createPath('error.ejs'),{title:'Error', role});
 });
};


const putCupEdit=(req,res)=>{
  const {name,text, price,contin}=req.body;
    const {id} = req.params;
      Cupon
      .findByIdAndUpdate(id,{name,text,price,contin})
      .then(result => res.redirect('/time'))
      .catch((error) => {
      console.log(error);
      res.render(createPath('error.ejs'),{title:'Error'});
      });
 
};




const frchekGet = async  (req,res) => {
  const user_login = req.query.login;
  let user = req.session.user;
  let role = user ? user.role : 'energy';

  // Поиск пользователя по логину в базе данных
  const buy_users  = await Buy.findOne({ user_login });
  if(buy_users){
    res.render(createPath('find_result_chek.ejs'), { buy_users, role });
  }
  else { 
    Buy
  .find()
  .sort({ createdAt : -1 })
  .then((buy_users) => res.render(createPath('chek_kup.ejs'), {buy_users, role}))
  .catch((error) => {
  console.log(error);
  res.render(createPath('error.ejs'),{title:'Error'});
  });
  }

};

module.exports={
 getCup,
 getTime,
 timePost,
 frchekGet,
 cuponPost,
 cupDelete,
 minSort,
 maxSort,
 filter,
 cuponDelete,
 putCupEdit,
 getCupEdit,
  };

