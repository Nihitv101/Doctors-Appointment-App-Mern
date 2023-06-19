import Layout from '../components/Layout';
import React from 'react'

import {Tab , Tabs, message, notification} from 'antd'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Notification = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()


    const {user} = useSelector(state=>state.user);

    // handle toast notification:



    const handleMarkAllRead = async ()=>{

        try{
            dispatch(showLoading());
            const res = await axios.post('/api/v1/users/get-all-notification', {userId: user._id}, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            })

            dispatch(hideLoading());

            if(res.data.success){
                message.success(res.data.message);
            }
            else{
                message.error(res.data.message);
            }

        }
        catch(err){
            console.log(err)
            message.error('Something went wrong');
        }

    }

    const handleDeleteAllRead = async()=>{
        try{
            dispatch(showLoading());
            const res = await axios.post('/api/v1/users/delete-all-notification', {
                userId: user._id
            }, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            dispatch(hideLoading());

            if(res.data.success){
                message.success(res.data.message)
            }
            else{
                message.error(res.data.message)
                
            }

        }
        catch(err){
            console.log(err);
            message.error('Something went wrong in Notification')
        }
    }


  return (
    <Layout>
        <h1 className='p-3 text-center'>Notification Page</h1>
        <Tabs>
            <Tabs.TabPane tab='Un-Read' key={0}>
                <div className="d-flex justify-content-end">
                    <h4 className='p-2' onClick={handleMarkAllRead}>Mark All Read</h4>
                </div>

                {
                    user?.notification.map(notifications=>(
                        <div 
                        className="card" 
                       style={{'cursor':"pointer"}}
                        
                        >
                            <div className="card-text" onClick={()=>navigate(notifications.onClickPath)} >
                                {notifications.message}
                            </div>
                        </div>
                    ))
                }

            </Tabs.TabPane> 

            


            <Tabs.TabPane tab='Read' key={1}>
                <div className="d-flex justify-content-end">
                    <h4 className='p-2 text-primary' style={{cursor:"pointer"}} onClick={handleDeleteAllRead}>Delete All Read</h4>
                </div>


                {/*  */}

                {
                    user?.seennotification.map(notifications=>(
                        <div 
                        className="card" 
                       style={{'cursor':"pointer"}}
                        
                        >
                            <div className="card-text" onClick={()=>navigate(notifications.onClickPath)} >
                                {notifications.message}
                            </div>
                        </div>
                    ))
                }




            </Tabs.TabPane>
        </Tabs>
    </Layout>
  )
}

export default Notification;
