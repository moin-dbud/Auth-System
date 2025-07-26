import axios from "axios";
import React, { useContext, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContext)
  const navigate = useNavigate()

  const inputRefs = React.useRef([]);

  const  handleInput = (e, index) => {
    if(e.target.value.length> 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(index < inputRefs.current.length) {
        inputRefs.current[index].value = char;
        if(index < inputRefs.current.length - 1) {
          inputRefs.current[index + 1].focus();
        }
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')
      const {data} = await axios.post(`${backendUrl}/api/auth/verify-account`, {otp})

      if(data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedIn, userData, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <h1
        onClick={() => navigate("/")}
        className="text-3xl absolute left-5 sm:left-20 top-5 w-3 sm:w-52 font-bold text-gray-800 cursor-pointer  max-sm:text-2xl max-md:flex-1 h-auto"
      >
        Auth System{" "}
      </h1>
      <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm" onSubmit={onSubmitHandler}>
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email verify OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email id.
        </p>
        <div className="flex justify-between mb-8">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer ">
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
