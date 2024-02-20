const express = require ('express');
const methodOverride=require('method-override');
const {
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
getCupEdit,
putCupEdit,
   } = require('../controllers/buy-controller');

   const router = express.Router();
   router.use(methodOverride('_method'));
router.get('/chek_cup', getCup);
router.delete('/chek_cup/:id', cupDelete);
router.get('/time', getTime); 
router.delete('/time/:id', cuponDelete);
router.get('/min_max', minSort); 
router.get('/max_min', maxSort); 
router.post('/filter', filter); 
router.post('/time', timePost); 
router.post('/cupon', cuponPost); 
router.get('/find_result_chek',frchekGet);

router.get('/edit_cup/:id', getCupEdit);
router.put('/edit_cup/:id', putCupEdit);

module.exports=router;