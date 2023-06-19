import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker, TimePicker, message } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
    const {user} = useSelector(state=>state.user);


  const params = useParams();

  const dispatch = useDispatch();

  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState();

  const getDoctorData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =============================== BOOKING FUNCTION ==================
  
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if(!date && !time){
        return alert('Date & Time Required')
      }
      dispatch(showLoading());
      const res = await axios.post("/api/v1/users/book-appointment", {
        doctorId: params.doctorId,
        userId: user._id,
        doctorInfo: doctors,
        userInfo:user,
        date: date,
        time:time,

      },{
        headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      dispatch(hideLoading());

      if(res.data.success){
        message.success(res.data.message)
      }


    } catch (err) {
      dispatch(hideLoading());
      console.log(err);
    }
  };


  const handleAvailability = async()=>{
    try{


      if(!date && !time){
        return alert('Date & Time Required')
      }
      
      dispatch(showLoading());
      const res = await axios.post('/api/v1/users/booking-availability', {
        doctorId:params.doctorId, date, time
      }, 
      {
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      dispatch(hideLoading());

      if(res.data.success){
        setIsAvailable(true);
        message.success(res.data.message)
      }else{
        message.error(res.data.message)
      }
    }
    catch(err){
      dispatch(hideLoading());
      console.log(err);
    }
  }

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      <h1>Booking</h1>

      <div className="container">
        {doctors && (
          <div>
            <h4>
              {" "}
              Dr. {doctors.firstName} {doctors.lastName}{" "}
            </h4>
            <h4>Fees: {doctors.feesPerConsultation}</h4>
            <h4>Experience: {doctors.experience}</h4>

            {/* <h4>Timings: {doctors.timings[0]} {doctors.timings[1]}</h4> */}

            <div className="d-flex flex-column w-50">
              <DatePicker
                format={"DD-MM-YYYY"}
                onChange={(value) =>{
      
                  setDate(moment(value).format("DD-MM-YYYY"))
                }
                }
              />

              <TimePicker
                format="HH:mm"
                onChange={(values) =>{ 

                  setTime(moment(values).format("HH:mm"))}}
              />
            </div>
            <button className="btn btn-primary m-2" onClick={handleAvailability}>Check Availability</button>

            
            <button onClick={handleBooking} className="btn btn-secondary m-2">
              Book Now
            </button>
              



          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
