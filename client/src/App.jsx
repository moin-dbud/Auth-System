import React from 'react'
import { useContext, useEffect } from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import EmailVerify from './pages/EmailVerify.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import { ToastContainer } from 'react-toastify';
import { AppContext } from './context/AppContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { getUserData } = useContext(AppContext);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/email-verify' element={<EmailVerify/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
      </Routes>
    </div>
  )
}

export default App
