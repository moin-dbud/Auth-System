import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Navbar = () => {

    const navigate = useNavigate()
    const {userData, backendUrl, clearAuthState} = useContext(AppContext)

    const sendVerificationOtp = async () => {
      try {
       axios.defaults.withCredentials = true; 

       const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp', )

       if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
       }else{
        toast.error(data.message)
       }

      } catch (error) {
        toast.error(error.message)  
      }
    }

    const logout = async () => {
      try {
        await axios.post(backendUrl + '/api/auth/logout');
        clearAuthState();
        toast.success('Logout Successful');
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        clearAuthState();
        toast.error(error.response?.data?.message || error.message || 'An error occurred');
      }
    }

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 " >
        <h1 className='text-3xl font-bold text-gray-800 cursor-pointer  max-sm:text-2xl max-md:flex-1 w-auto h-auto' >Auth-System</h1>

        {userData ?
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group' >
            {userData.name[0].toUpperCase()}
            <div className='hidden group-hover:block absolute top-0 z-10 right-0  text-black pt-10 rounded w-32 cursor-pointer '>
              <ul className='list-none m-0 p-2 bg-gray-100 text-sm cursor-pointer' >
                {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200' >Verify Email</li>}
                <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 pr-10' >Logout</li>

              </ul>
            </div>
        </div>
        : <button onClick={()=>navigate('/login')} className="flex items-center gap-2 cursor-pointer border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all" ><img src={assets.arrow_icon} alt="" />Login</button>
        }
        
    </div>
  )
}

export default Navbar
