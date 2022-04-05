const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'profile'), userController.getUser);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.put('/user/:userId/file-tax', userController.allowIfLoggedin, userController.grantAccess('updateOwn', 'profile'), userController.fileTax);

router.put('/user/:userId/calculate-tax', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.calculateTax);

router.put('/user/:userId/pay-tax', userController.allowIfLoggedin, userController.grantAccess('updateOwn', 'profile'), userController.payTax);



module.exports = router;