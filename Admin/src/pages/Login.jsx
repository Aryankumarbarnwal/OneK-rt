import React, { useState, useContext } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import axios from "axios"
import AuthDataContext from '../context/AuthDataContext.jsx'
import AdminDataContext from '../context/AdminDataContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../component/Loading.jsx';

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading , setLoading] = useState(false)

  const { serverUrl } = useContext(AuthDataContext);
  
  let {getAdmin} = useContext(AdminDataContext)
  let navigate = useNavigate()

  const AdminLogin = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/adminlogin",
        { email, password },
        { withCredentials: true }
      );
      console.log(result.data);
      toast.success("Admin Login Succefully")

      if(getAdmin){
        getAdmin()
      }

      navigate("/")
    } catch (error) {
      console.log(error);
      toast.error("Admin Login Failed")
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l 
    from-[#141414] to-[#162b30] text-white
    flex flex-col items-center justify-start'>

      {/* Header */}
      <div className='w-full h-[80px] flex items-center justify-start px-8 cursor-pointer'>
        <img className='w-[40px]' src="vcart logo.png" alt="logo" />
        <h1 className='text-[22px] font-sans'>OneKart</h1>
      </div>

      {/* Welcome Section */}
      <div className='w-full h-[100px] flex flex-col items-center justify-center gap-2'>
        <span className='text-[25px] font-semibold'>Login Page</span>
        <span className='text-[16px]'>Welcome to OneKart, Apply to Admin Login</span>
      </div>

      {/* Login Form */}
      <div className='max-w-[600px] w-[90%] h-[400px] bg-[#00000025] border border-[#96969635]
      backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center'>
        <form
          onSubmit={AdminLogin}
          className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'
        >
          <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-4 relative'>

            {/* Email */}
            <input
              type="email"
              className='w-full h-[50px] border-[2px] border-[#96969635]
              backdrop-blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-5
              font-semibold'
              placeholder='Email'
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            {/* Password */}
            <input
              type={show ? "text" : "password"}
              className='w-full h-[50px] border-2 border-[#96969635]
              backdrop-blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-5
              font-semibold'
              placeholder='Password'
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            {/* Eye Section */}
            {!show && 
              <Eye className='w-[20px] h-[20px] 
            cursor-pointer absolute right-[5%] bottom-[50%]' 
            onClick={()=>setShow(prev => !prev)

            }
            />}
            {show && 
              <EyeOff className='w-[20px] h-[20px] cursor-pointer 
              absolute right-[5%] bottom-[50%]'  
              onClick={()=>setShow(prev => !prev)}
              />}

            {/* Button */}
            <button
              type="submit"
              className='w-full h-[50px] bg-[#6060f5]
              rounded-lg flex items-center justify-center mt-5 text-[17px]
              font-semibold'
            >
              {loading ? <Loading/> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
