const doctorModel = require('../model/doctor.model');
const UserModel = require('../model/user.model')



const getAllUsersController = async (req, res)=>{
    try{

        const users = await UserModel.find({});

        res.status(200).json({
            success:true,
            message:"Users Data",
            data:users,
        })


    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:'Error While Fetching Users',
            err,
        })

    }



}


const getAllDoctorsController = async (req, res)=>{
    try{

        const doctors = await doctorModel.find({});

        res.status(200).json({
            success:true,
            message:"Doctors Data List",
            data:doctors,
        })


    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Error while gettign doctors data",
            err,
        })

    }
}


const changeAccountStatus = async(req,res)=>{
    try{

        const {doctorId, status} = req.body;

        const doctor = await doctorModel.findByIdAndUpdate(doctorId, {status})

        const user = await UserModel.findOne({_id:doctor.userId})
        const notification = user.notification

        notification.push({type:'Doctor-account-request-updated',
            message:`Your Doctor Account Has ${status}`,
            onclickPath:'/notification'
        })

        user.isDoctor = status === 'approved' ? true : false;

        await user.save();
        res.status(201).json({
            success:true,
            message:"Account Status Updated",
            data:doctor,
        })




    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"Error in Account Status",
            err,
        })
    }

}



module.exports = {getAllUsersController, getAllDoctorsController, changeAccountStatus};
