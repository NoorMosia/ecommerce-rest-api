const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user-controllers');

router.get('/users', userControllers.getAllUsers);
router.get('/users/:userId', userControllers.getUserDetails);

// router.get('/user/:userId/edit-pic',userController.getEditPic);
// router.post('/user', userController.postEditPic);

module.exports = router;