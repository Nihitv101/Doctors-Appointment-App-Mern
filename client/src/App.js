import React from 'react';
import {BrowserRouter, Routes , Route} from 'react-router-dom'


import HomePage from './Pages/HomePage';
import Login from './Pages/Login';
import Register from './Pages/Register';


import { useSelector } from 'react-redux';
import Spinner from './components/Spinner';
import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoutes from './components/PublicRoutes';
import ApplyDoctor from './Pages/ApplyDoctor';
import Notification from './Pages/Notification';
import Users from './Pages/Admin/Users';
import Doctors from './Pages/Admin/Doctors';
import Profile from './Pages/Doctor/Profile';
import BookingPage from './Pages/BookingPage';
import Appointments from './Pages/Appointments';
import DoctorAppointments from './Pages/Doctor/DoctorAppointments';



const App = () => {

  const {loading} = useSelector(state=>state.alerts)


  return (
    <>
      <BrowserRouter>
      {
        loading ? ( <Spinner />) :
        (
          <Routes>

            <Route 
            path='/' 
            element={
              <ProtectedRoutes>
                <HomePage />
              </ProtectedRoutes>
            } />

            <Route 
            path='/login' 
            element={
              <PublicRoutes>
                  <Login />
              </PublicRoutes>
            } />


            <Route path='/register' element={
              <PublicRoutes>
                  <Register />
              </PublicRoutes>
            }/>

            <Route path='/apply-doctor' element={
              <ProtectedRoutes>
                  <ApplyDoctor />
              </ProtectedRoutes>
            }/>


            <Route path='/notification' element={
              <ProtectedRoutes>
                  <Notification />
              </ProtectedRoutes>
            }/>


            {/* Admin Routes */}


            <Route path='/admin/users' element={
              <ProtectedRoutes>
                  <Users />
              </ProtectedRoutes>
            }/>

            <Route path='/admin/doctors' element={
              <ProtectedRoutes>
                  <Doctors />
              </ProtectedRoutes>
            }/>

            <Route path='/doctor/profile/:id' element={
              <ProtectedRoutes>
                  <Profile />
              </ProtectedRoutes>
            }/>


            <Route path='/doctor/book-appointment/:doctorId' element={
              <ProtectedRoutes>
                  <BookingPage />
              </ProtectedRoutes>
            }/>

            <Route path='/appointments' element={
              <ProtectedRoutes>
                  <Appointments />
              </ProtectedRoutes>
            }/>


            <Route path='/doctor-appointments' element={
              <ProtectedRoutes>
                  <DoctorAppointments />
              </ProtectedRoutes>
            }/>


          </Routes>
        )
      }
      </BrowserRouter>
    </>
  )
}



export default App


