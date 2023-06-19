import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom'

import { showLoading, hideLoading } from '../../redux/features/alertSlice';


import moment from 'moment';


import {Col, Form, Grid, Input, Row, TimePicker, message} from 'antd'


const Profile = () => {
    const {user} = useSelector(state=>state.user);

    const [doctor, setDoctor] = useState(null);

    const params = useParams();

    const getDoctorInfo = async()=>{
        try{
            const res = await axios.post('/api/v1/doctor/getDoctorInfo' , {
                userId: params.id
            }, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if(res.data.success){
                setDoctor(res.data.data)
            }
        }
        catch(err){
            console.log(err);
        }

    }

    useEffect(()=>{
        getDoctorInfo();
    }, [])


    // ========= UPDATE DOC  =-===================



    const dispatch = useDispatch();
    const navigate = useNavigate();





    const handleFinish = async (values)=>{
        try{
            dispatch(showLoading());
            const res = await axios.post('/api/v1/doctor/updateProfile',{...values, userId:user._id, timings:[
                moment(values.timings[0]).format('HH:mm'),
                moment(values.timings[1]).format('HH:mm')
            ]}, {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })

            dispatch(hideLoading());

            if(res.data.success){
                message.success(res.data.message);
                navigate('/')
            }
            else{
                message.error(res.data.message);
            }
        }
        catch(err){
            dispatch(hideLoading())
            console.log(err);
            message.error("Something Went Wrong")

        }
    }



 

  return (
    <Layout>
        <h1>Manage Profile</h1>
        {doctor && (
            <Form layout='vertical' onFinish={handleFinish}
        className='m-3' initialValues={{
            ...doctor,
            timings:[
                moment(doctor.timings[0], 'HH:mm'),
                moment(doctor.timings[1], 'HH:mm')
            ]
            

        }}>

                <h4>Personal Details</h4>

            <Row gutter={20}>

                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='First Name' name='firstName' rules={[{required:true}]}>
                        <Input type='text' placeholder='your name' />
                    </Form.Item>

                </Col>

                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='Last Name' name='lastName' rules={[{required:true}]}>
                        <Input type='text' placeholder='your name' />
                    </Form.Item>

                </Col>

                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='Phone Number' name='phone' rules={[{required:true}]}>
                        <Input type='text' placeholder='your Phone' />
                    </Form.Item>

                </Col>
                
                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='Email' name='email' rules={[{required:true}]}>
                        <Input type='email' placeholder='your Email' />
                    </Form.Item>

                </Col>

                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='Website URL' name='website'>
                        <Input type='text' placeholder='your Website' />
                    </Form.Item>

                </Col>
                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='Address' name='address' rules={[{required:true}]}>
                        <Input type='text' placeholder='your Address' />
                    </Form.Item>

                </Col>


            </Row>


            {/* Doctor Professional Details */}



                <h4>Professional Details</h4>

            <Row gutter={20}>

                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='specialization' name='specialization' rules={[{required:true}]}>
                        <Input type='text' placeholder='your specialization' />
                    </Form.Item>

                </Col>

                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='experience' name='experience' rules={[{required:true}]}>
                        <Input type='text' placeholder='your experience' />
                    </Form.Item>

                </Col>

                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='feesPerConsultation' name='feesPerConsultation' rules={[{required:true}]}>
                        <Input type='text' placeholder='your feesPerConsultation' />
                    </Form.Item>

                </Col>
                
        
                <Col xs={24} md={24} lg={8}>

                    <Form.Item label='timings' name='timings' required>
                        <TimePicker.RangePicker format='HH:mm' />
                    </Form.Item>
                </Col>

                <Col xs={24} md={24} lg={8}>
                <div className="d-flex justify-content-end">
                    <button className='btn btn-primary form-btn' type='submit'>Update</button>

                </div>
                </Col>
      

            </Row>


  

        </Form>
        )}
    </Layout>
  )
}

export default Profile;
