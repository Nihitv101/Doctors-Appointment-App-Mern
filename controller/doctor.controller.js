const appointmenModel = require("../model/appointment.model");
const doctorModel = require("../model/doctor.model");
const UserModel = require("../model/user.model");

const getDoctorInfoController = async(req, res)=>{
    try{

        const doctor = await doctorModel.findOne({userId: req.body.userId});

        res.status(200).json({
            success:true,
            message:"Doctor data fetch success",
            data:doctor,
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            err,
            message:"Error in Fetching Doctor Details"
        })

    }
}



const updateProfileController = async(req, res)=>{
    try{

        const {userId} = req.body;
        // const doctor = await doctorModel.findByIdAndUpdate(req.body.
        // userId,req.body, {new:true});

        const doctor = await doctorModel.findOneAndUpdate({userId}, req.body, {new:true});





        res.status(201).json({
            success:true,
            message:"Doctor Profie Updated",
            data:doctor,
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            err,
            message:"Error in Updating"
        })

    }

}


const getDoctorByIdController = async(req, res)=>{
    try{
        const doctor = await doctorModel.findOne({_id: req.body.doctorId});
        res.status(201).json({
            success:true,
            message:"Doctor Profie Updated",
            data:doctor,
        })
        

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            err,
            message:"Error in Single doct info"
        })
    }

}


const doctorAppointmentsController = async(req, res)=>{

    try{
        const doctor = await doctorModel.findOne({userId:req.body.userId});
        const appointments  = await appointmenModel.find({doctorId:doctor._id});

        res.status(200).json({
            success:true,
            message:"Doctor Appointments Fetch Successfully",
            data:appointments

        })

        


    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            err,
            message:"Error in Doc Appointments"
        })
    }     
}


const updateStatusController = async(req,res)=>{

    try{

        const {appointmentsId, status, userId} = req.body;



        const appointments = await appointmenModel.findByIdAndUpdate(appointmentsId, {status});


        const user = await UserModel.findOne({ _id: appointments.userId });


        const notification = user.notification;
        notification.push({
          type: "Status Updated",
          message: `Your Appointments has been updated ${status}`,
          onClickPath: "/doctor-appointments",
        });
    
        await user.save();

        res.status(200).json({
            success:true,
            message:"Appointment Status Updated"
        })

    


    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            err,
            message:"Error in Doc Appointments"
        })    
    }
}



module.exports = {getDoctorInfoController, updateProfileController, 
    getDoctorByIdController, doctorAppointmentsController, updateStatusController};
