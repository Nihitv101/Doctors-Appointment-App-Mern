const express = require('express');
const { loginController, registerController, authController , applydoctorController , getAllNotificationController, deleteAllnotificationController, getAllDoctorControllers ,bookAppointmentController, bookingAvailabilityController, userAppointmentController} = require('../controller/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// router:

router.post('/login', loginController);

router.post('/register', registerController);

router.post('/getUserData', authMiddleware , authController);

router.post('/apply-doctor', authMiddleware, applydoctorController);

// notification 

router.post('/get-all-notification', authMiddleware, getAllNotificationController);


router.post('/delete-all-notification', authMiddleware, deleteAllnotificationController);



// Get All Doctors:
router.get('/getAllDoctors', authMiddleware, getAllDoctorControllers);



// Book Apoointment:
router.post('/book-appointment', authMiddleware, bookAppointmentController);



// Booking Availability:

router.post('/booking-availability', authMiddleware, bookingAvailabilityController);



// Appointment List:
router.get('/user-appointments', authMiddleware, userAppointmentController);



module.exports = router;




