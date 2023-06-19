import React from "react";
import { Button, Form, Input } from "antd";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

import toast from 'react-hot-toast'

import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useDispatch } from "react-redux";


const Register = () => {

    const dispatch = useDispatch();


    const navigate = useNavigate();



  const onFinishHandler = async (values) => {
    try{

      dispatch(showLoading());
      
      
      const res = await axios.post('/api/v1/users/register', values)
      
      dispatch(hideLoading());

      // console.log(res.data);

        if(res.data.success === true){
            console.log("Registered Successfully")
            toast.success(res.data.message)
            navigate('/login');
        }
        else{

            toast.error(res.data.message)
        }

    }
    catch(err){
      dispatch(hideLoading());

        console.log(err);
        
    }
  };

  return (
    <div className="form-container">
      <Form
        layout="vertical"
        onFinish={onFinishHandler}
        className="register-form"
      >
        <h1 className="text-center">Register Form</h1>
        <Form.Item label="Name" name="name">
          <Input type="text" required />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>

        <Link to={"/login"}>
          Already registered ? <i>Login Here</i>
        </Link>

        <button className="btn btn-primary" type="submit">
          Register
        </button>
      </Form>
    </div>
  );
};

export default Register;
