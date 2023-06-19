const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDoctorInfoController ,updateProfileController , getDoctorByIdController, doctorAppointmentsController,updateStatusController} = require('../controller/doctor.controller');

const router = express.Router();


router.post('/getDoctorInfo', authMiddleware, getDoctorInfoController);


// update Profile

router.post('/updateProfile', authMiddleware, updateProfileController);

 

router.post('/getDoctorbyId', authMiddleware, getDoctorByIdController);


router.get('/doctor-appointments', authMiddleware, doctorAppointmentsController);



router.post('/update-status', authMiddleware, updateStatusController);



module.exports = router;
