import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { setUser } from '../redux/features/userSlice';


const ProtectedRoutes = ({children}) => {
    const dispatch = useDispatch();
    const {user} = useSelector(state=> state.user);


    // get user:
    const getUser = async ()=>{
        try{
            dispatch(showLoading());
            const res = await axios.post('/api/v1/users/getUserData', {
                token: localStorage.getItem('token')
            },
            {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            dispatch(hideLoading())

            if(res.data.success){
                // console.log('Rest data'res.data)
                dispatch(setUser(res.data.data))
            }
            else{
                <Navigate to='/login'/>
                localStorage.clear();
            }
        }
        catch(err){
            dispatch(hideLoading())
            console.log(err);
        }
    }

    useEffect(()=>{
        if(!user){
            getUser();
        }
    },[user])



    if(localStorage.getItem('token')){
        return children
    }
    else{
        return <Navigate to='/login' />
    }
  
}

export default ProtectedRoutes;
