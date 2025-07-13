import React, { useContext } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import AuthDtaContext from '../context/AuthDataContext.jsx'
import AdminDataContext from '../context/AdminDataContext.jsx'
import Loading from './Loading.jsx'
import { useState } from 'react'
import { toast } from 'react-toastify'


function Nav() {
    let navigate = useNavigate()
    let {serverUrl} = useContext(AuthDtaContext)
    let {getAdmin} = useContext(AdminDataContext)
    const [loading , setLoading] = useState(false)

    const logout = async ()=>{
        setLoading(true)
        try {
            const result = await axios.get(serverUrl + 
                "/api/auth/logout", {withCredentials:true})
            console.log(result.data);
            toast.success("Logout SuccessFully");
            getAdmin();
            navigate("/login");
            
        } catch (error) {
         console.log(error)   
         toast.error("Logout Failed")
        }
    }

  return (
    <div className='w-[100vw] h-[70px] 
    bg-[#dcdbdbf8] z-10 fixed top-0 flex 
    items-center justify-between px-[30px]
    overflow-x-hidden shadow-md shadow-black'
    >
    <div className='w-[30%] flex items-center 
    justify-start gap-[10px] cursor-pointer' 
    onClick={()=>navigate("/")}>
        <img src="vcart logo.png" alt="" className='w-[30px]'/>
        <h1 className='text-[25px] text-[black] font-sans'>
            OneK@rt</h1>

    </div>
    <button className='text-[15px] hover:border-[2px] 
            border-[#89daea] cursor-pointer bg-[#000000ca] 
            py-[10px] px-[20px] rounded-2xl text-white' onClick={logout}>
                {loading ? <Loading/> : "LogOut"}</button>
    </div>
  )
}

export default Nav