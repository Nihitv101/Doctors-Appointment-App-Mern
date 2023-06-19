import React from "react";
import { Button, Form, Input } from "antd";
import "./Register.css";
import { Link } from "react-router-dom";


import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { useDispatch } from "react-redux";

import { showLoading, hideLoading } from "../redux/features/alertSlice";





const Login =  () => {

  const dispatch = useDispatch();


  const navigate = useNavigate();



  const onFinishHandler = async (values) => {
    try{
        dispatch(showLoading());

        const res = await axios.post('/api/v1/users/login', values);

        dispatch(hideLoading());
        
        
        if(res.data.success){

            localStorage.setItem('token', res.data.token)
            
            toast.success(res.data.message);
            navigate('/')
            
            
        }
        else{
            dispatch(hideLoading());
            toast.error(res.data.message);
        }


    }
    catch(err){
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
        <h1 className="text-center">Login Form</h1>

        <Form.Item label="Email" name="email">
          <Input type="email" required />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" required />
        </Form.Item>

        <Link to={"/register"}>
          Not registered ? <i>Register Here</i>
        </Link>

        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </Form>
    </div>
  );
};

export default Login;
