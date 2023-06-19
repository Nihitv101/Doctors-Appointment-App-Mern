const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUsersController, getAllDoctorsController , changeAccountStatus} = require('../controller/admin.controller');
const router = express.Router();




router.get('/getAllUsers',authMiddleware, getAllUsersController)


router.get('/getAllDoctors', authMiddleware, getAllDoctorsController);

// Post Account Status
router.post('/changeAccountStatus', authMiddleware, changeAccountStatus)

module.exports = router;
