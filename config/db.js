const mongoose = require('mongoose');

const connectDB = async (req, res , next)=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('database Connected')
    }
    catch(err){
        console.log(err);
    }
}

module.exports = connectDB;
