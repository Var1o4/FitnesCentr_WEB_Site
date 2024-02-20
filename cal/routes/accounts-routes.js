const express = require ('express');
const methodOverride=require('method-override');

const {
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
    }= require('../controllers/account-controller');
const router = express.Router();
router.use(methodOverride('_method'));
router.get('/edit/:id', getEdit);
router.put('/edit/:id', putEdit);
router.get('/work-whith-account', wwaGet);
router.get('/find-result', find_resultGet);
router.delete('/work-whith-account/:id', wwaDelete);
router.post('/work-with-account', wwaPost);
router.get('/register', registerGet);
router.post('/register', registerPost);
router.get('/login', loginGet);
router.post('/login', loginPost);





module.exports=router;