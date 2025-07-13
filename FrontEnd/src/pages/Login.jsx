import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc';
import { useContext } from 'react';
import AuthDataContext from '../context/AuthDataContext';
import UserDataContext from '../context/UserDataContext.jsx';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import {auth, provider} from '../../util/FireBase'
import {toast} from 'react-toastify'


function Login()  {
  let [show, setShow] = useState(false);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let {serverUrl} = useContext(AuthDataContext);
  let {getCurrentUser} = useContext(UserDataContext)

  let navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
      let result = await axios.post(serverUrl + '/api/auth/login',
        {email, password},{withCredentials:true})
        console.log(result.data);

      toast.success("Login Successfully");
      getCurrentUser();
      navigate('/')

    }
    catch (error){
      console.log(error);
    }
  }
  const googleLogin = async ()=>{
    try{
      const response = await signInWithPopup(auth, provider);
      let user = response.user
      let name = user.displayName;
      let email = user.email;

      const result = await axios.post(serverUrl + '/api/auth/googlelogin',
        {name, email},{withCredentials:true})
        console.log(result.data);

        toast.success("Login Successfully")
        getCurrentUser();
        navigate("/");
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l 
    from-[#141414] to-[#162b30] text-[white]
      flex flex-col items-center justify-start'>
      <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gep-[-10px]
          cursor-pointer' onClick={() => navigate("/")}>
        <img className='w-[40px]' src="vcart logo.png" alt="logo" />
        <h1 className='text-[22px] font-sans '>OneKart</h1>
      </div>

      <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[-10]'>
        <span className='text-[25px] font-semibold'>Login Page</span>
        <span className='text-[16px]'>Welcome to OneKart, Place your order</span>
      </div>


      <div className='max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border-[1px] border-[#96969635]
          background:blur-2xl rounded-lg shadow-lg flex items-center justify-center'>
        <form onSubmit={handleLogin} action="" className='w-[90%] h-[90%] flex flex-col items-center 
              justify-start gap-[20px] '>

          {/* Sign Up With Google  */}

          <div className='w-[90%] h-[50px] bg-[#42656cae] rounded-lg flex items-center
              justify-center gap-[10px] py-[20px] cursor-pointer ' onClick={googleLogin}>
            <FcGoogle size={30} />
            <span>Sign in From Google</span>
          </div>

          {/* OR Section */}
          <div className='w-[100%] h-[20px] flex items-center justify-center gap-[10px]'>
            <div className='w-[40%] h-[1px] bg-[#96969635] '></div> OR <div className='w-[40%] h-[1px] bg-[#96969635]'></div>
          </div>

          {/* input Fields */}

          <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px] relative'>
            <input type="Email" className='w-[100%] h-[50px] border-[2px] border-[#96969635] 
            backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] 
            font-semibold' placeholder='Email' required onChange={(e)=>setEmail(e.target.value)} value={email}/>

            <input type={show?"text" : "password"} className='w-[100%] h-[50px] border-[2px] border-[#96969635] 
            backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] 
            font-semibold' placeholder='Passowrd' required onChange={(e)=>setPassword(e.target.value)} value={password}/>

            {/* Eye Section */}
            {!show && <Eye className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[57%]' onClick={()=>setShow(prev => !prev)}/>}
            {show && <EyeOff className='w-[20px] h-[20px] cursor-pointer absolute right-[5%] bottom-[57%]'  onClick={()=>setShow(prev => !prev)}/>}

            {/* Button Section */}
            <button className='w-[100%] h-[50px] bg-[#6060f5] rounded-lg flex items-center 
            justify-center mt-[20px] text-[17px] font-semibold'>Login</button>
            <p className='flex gap-[10px]'>You haven't any account? 
              <span className='text-[#5555f6cf] text-[17px] font-semibold cursor-pointer' onClick={()=>navigate("/signup")} >Create New Account</span></p>
          </div>
          
        </form>
      </div>

    </div>
  )
}

export default Login