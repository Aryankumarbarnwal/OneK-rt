import React from 'react'
import Nav from '../component/Nav.jsx'
import Sidebar from '../component/Sidebar.jsx'
import { useState, useContext } from 'react'
import AuthDataContext from '../context/AuthDataContext.jsx'
import axios from 'axios'
import { useEffect } from 'react'

function Home() {

  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)

  const {serverUrl} = useContext(AuthDataContext)

  const fetchCounts = async () =>{
    try {
      const products = await axios.get(`${serverUrl}/api/product/list`, {}, {withCredentials:true})
      setTotalProducts(products.data.length)
      
      const orders = await axios.post(`${serverUrl}/api/order/list`, {}, {withCredentials:true})
      setTotalOrders(orders.data.length)
    } catch (error) {
      console.log("Failed to fetch counts", error);
    }
  }

  useEffect(()=>{
    fetchCounts()
  },[])

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] 
    to-[#0c2025] text-[white] relative '>
      <Nav/>
      <Sidebar/>
      <div className='w-[70vw] h-[100vh] absolute left-[25%] flex items-start
      justify-start flex-col gap-[40px] py-[100px]'>
        <h1 className='text-[35px] text-[#afe2f2]'>OneK@rt Admin Panel</h1>
        <div className='flex items-center justify-start gap-[50px] flex-col md:flex-row'>
          
          {/* Total Products Box */}
          <div className='text-[#dcfafd] w-[400px] max-w-[90%] h-[200px]
          bg-[#0000002e] flex items-center justify-center flex-col gap-[20px]
          rounded-lg shadow-sm shadow-black backdrop-blur-lg md:text-[25px] text-[20px]
          border-[1px] border-[#969595]'>Total No. of Products <span
          className='px-[20px] py-[10px] bg-[#030e11] rounded-lg flex items-center 
          justify-center border-[1px] border-[#969595]'>{totalProducts}</span></div>

          {/* Total Orders Box */}
          <div className='text-[#dcfafd] w-[400px] max-w-[90%] h-[200px]
          bg-[#0000002e] flex items-center justify-center flex-col gap-[20px]
          rounded-lg shadow-sm shadow-black backdrop-blur-lg md:text-[25px] text-[20px]
          border-[1px] border-[#969595]'>Total No. of Orders <span
          className='px-[20px] py-[10px] bg-[#030e11] rounded-lg flex items-center 
          justify-center border-[1px] border-[#969595]'>{totalOrders}</span></div>
        </div>
      </div>
    </div>
  )
}

export default Home