const UserModel = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const doctorModel = require("../model/doctor.model.js");
const appointmenModel = require("../model/appointment.model.js")
const moment = require('moment')

const registerController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }

    // password hashing:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = await UserModel.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Registered Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: `Register Controller ${err.message}`,
    });
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User Not Registered",
      });
    }

    // if user check valid user:

    const isMatch = bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(200).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login Controller Error",
    });
  }
};

const authController = async (req, res, next) => {
  try {
    const user = await UserModel.findById({ _id: req.body.userId });
    user.password = undefined;

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User Not Found",
      });
    } else {
      res.status(200).json({
        success: true,
        data: user,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Auth Error",
      err,
    });
  }
};

const applydoctorController = async (req, res, next) => {
  try {
    const newDoctor = await doctorModel.create({
      ...req.body,
      status: "pending",
    });

    const adminUser = await UserModel.findOne({ isAdmin: true });

    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied for A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });

    await UserModel.findByIdAndUpdate(adminUser._id, { notification });

    res.status(201).json({
      success: true,
      message: "Doctor Account Applied Successfuly",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error While Applying for doctor",
      err,
    });
  }
};

const getAllNotificationController = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "All Notification marked read",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error in Notification",
      success: false,
      err,
    });
  }
};

// Delte Notification:

const deleteAllnotificationController = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updateUser = await user.save();

    updateUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "Notification Delted Successfully",
      data: updateUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error in Delete Notification",
      success: false,
      err,
    });
  }
};

const getAllDoctorControllers = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });

    res.status(200).json({
      success: true,
      message: "Doctor list fetched Successfully",
      data: doctors,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error in Getting Doctors",
      success: false,
      err,
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {

    req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
    req.body.time = moment(req.body.time, 'HH:mm').toISOString();



    
    req.body.status = "pending";
    const newAppointment = await appointmenModel.create(req.body);

    const user = await UserModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-Appointment Request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Appointment Book Successfully",
      newAppointment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error in Appointment Booking",
      success: false,
      err,
    });
  }
};



const bookingAvailabilityController = async(req, res)=>{
    try{
        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
        
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();



        const doctorId = req.body.doctorId;

        // check on the basis of timing:
        const appointments = await appointmenModel.find({doctorId, date, time:{
            $gte:fromTime, $lte:toTime

        }});


        if(appointments.length > 0){
            return res.status(200).json({
                success:true,
                message:"Appointment not Available at this time",
            })
        }
        else{
            return res.status(200).json({
                success:true,
                message:"Appoinement Available"
            })
        }


    }
    catch(err){
        console.log(err);
        res.status(500).json({
          message: "Error in Booking Availability",
          success: false,
          err,
        });
    }
}



const userAppointmentController = async(req, res)=>{

    try{
        const appointments = await appointmenModel.find({userId: req.body.userId});
        res.status(200).json({
            success:true,
            message:"Users Appointments Fetch Successfully",
            data:appointments,
        })


        
    }
    catch(err){
        console.log(err);
        res.status(500).json({
          message: "Error in User Appointments",
          success: false,
          err,
        });
    }
}



module.exports = {
  loginController,
  registerController,
  authController,
  applydoctorController,
  getAllNotificationController,
  deleteAllnotificationController,
  getAllDoctorControllers,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentController
};
