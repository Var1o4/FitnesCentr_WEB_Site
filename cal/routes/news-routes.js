const express = require ('express');
const {getNew,
  getNews,
  deleteNews,
  addNews,
  getAdd,} = require('../controllers/new-controller');




const router = express.Router();

router.get('/news/:id', getNew);
router.delete('/news/:id', deleteNews);
router.post('/add-news',addNews);
router.get('/add-news', getAdd);
router.get('/news', getNews);


  module.exports=router;