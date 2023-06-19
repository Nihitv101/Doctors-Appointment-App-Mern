const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const connectDB = require('./config/db.js');
const userRoutes = require('./routes/user.route.js');
const adminRoutes = require('./routes/admin.route.js');
const doctorRoutes = require('./routes/doctor.route.js')

const path = require('path');


dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB();






const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors())

// routes:

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/doctor',doctorRoutes);



// static files

app.use(express.static(path.join(__dirname, './client/build')));


app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})



app.listen(PORT, ()=>{
    console.log(`server is listening on http://localhost:${PORT}`);
})