const express = require('express')
const userController = require('../controllers/user-controller')
const router = express.Router();

router.get('/login',userController.userSignupPage)
router.post('/signup',userController.userSignup)
router.post('/login',userController.userLogin)
router.get('/user',userController.verifyToken,userController.getUser)


module.exports = router