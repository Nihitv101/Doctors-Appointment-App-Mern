import React from 'react';
import '../styles/layout.css';

import { adminMenu, userMenu } from '../Data/data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import toast from 'react-hot-toast'
import { setUser } from '../redux/features/userSlice';
import { Badge } from 'antd';




const Layout = ({children}) => {

    const dispatch = useDispatch();


    const location = useLocation();
    const navigate = useNavigate();

    const {user} = useSelector(state => state.user);


    // rendering menu list:


    
    const handleLogout = ()=>{
        localStorage.clear();
        dispatch(setUser(null))
        toast.success("Logout Successfully")


        navigate('/login');



        // window.location.reload();
    
    }







    //  =============================================== DOCTOR MENU ===============================


     const doctorMenu = [
        {
            name:'Home',
            path:'/',
            icon:'fa-solid fa-house'
        },
        {
            name:'Appointments',
            path:'/doctor-appointments',
            icon:'fa-solid fa-list'
        },
        {
            name:'Profile',
            path:`/doctor/profile/${user?._id}`,
            icon:'fa-solid fa-user'
        },
    
    ]

    const sideBarMenu = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu ;

    


    

  return (
    <>
        <div className="main">
            <div className="layout">
                <div className="sidebar">
                    <div className="logo">
                        <h6>Doc App</h6>
                    </div>
                    <div className='line'></div>
                    <div className="menu">
                        {
                            sideBarMenu.map(menu => { 
                                const isActive = location.pathname === menu.path;

                                return (
                                <>
                                    <div className={`menu-item ${isActive && "active"}`}>
                                        <Link to={menu.path}>{menu.name}
                                        </Link>
                                        <i className={menu.icon}></i>
                                    </div>
                                </>
                            )})
                        }


                        <div className={`menu-item`} onClick={handleLogout}>
                            <Link to={'/login'}>Logout</Link>
                        <i class="fa-solid fa-right-from-bracket"></i>
                        </div>

                        
                    </div>
                </div>
                <div className="content">
                    <div className="header">
                        <div className="header-content" style={{"cursor":"pointer"}}>


                        <Badge count={user?.notification.length} onClick={()=>{navigate('/notification')}}>
                            <i className="fa-solid fa-bell notification-bell" ></i>
                        </Badge>



                            
                            <Link to={'/profile'}>{user?.name}</Link>
                        </div>
                    </div>
                    <div className="body">{children}</div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Layout;
