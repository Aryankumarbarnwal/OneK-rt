import React from 'react'
import Title from '../components/Title'
import { useState, useContext } from 'react'
import CartTotal from '../components/CartTotal.jsx'
import razorpay from '../assets/Razorpay.webp'
import ShopDataContext from '../context/ShopDataContext.jsx'
import AuthDataContext from '../context/AuthDataContext.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';


function PlaceOrder() {

  let [method, setMethod] = useState('cod')
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(ShopDataContext)
  let { serverUrl } = useContext(AuthDataContext)
  let navigate = useNavigate();

  let [formData, setFormData] = useState({
    firstName: '',
    lastName:'',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({ ...data, [name]: value }))
  }

  const initPay = (order) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Order Payment',
    description: 'Order Payment',
    order_id: order.id,
    handler: async function (response) {
      console.log("✅ Payment Successful");
      console.log(response); // Contains razorpay_payment_id, etc.

      // verify payment on backend here
      const {data} = await axios.post(serverUrl + '/api/order/verifyrazorpay',
         response,{withCredentials:true})
         if(data){
          toast.success("🎉 Payment successful and order placed!");
          navigate("/order")
          setCartItem({})
         }
    },
    prefill: {
      name: formData.firstName + ' ' + formData.lastName,
      email: formData.email,
      contact: formData.phone,
    },
    theme: {
      color: '#3399cc',
    },
  };
  console.log("RazorPAy Frontend config:", options);

  // ✅ Create and open Razorpay instance outside the handler
  const rzp = new window.Razorpay(options);
  rzp.open();
};


  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      let orderItems = []
      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))

            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItem[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {
        case 'cod': {
          const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true });
          
          if(result.data){
            toast.success("🎉 Order placed successfully with Cash on Delivery!");
            setCartItem({})
            navigate("/order")
          }
          else{
            toast.error(result.data.message || "Something went wrong while placing the order.");
            console.log(result.data.message)
          }
          break;
        }

        case 'razorpay':{
          const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData,{withCredentials:true});

          if(resultRazorpay.data){
            initPay(resultRazorpay.data)
          }
          break;
        }
          

        default: {
          break;
        }
      }
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className='w-full min-h-[100vh] bg-gradient-to-l from-[#141414]
    to-[#0c2025] flex items-center justify-center flex-col md:flex-row gap-[50px]
    relative'>
      <div className='lg:w-[50%] w-[100%] h-[100%] flex items-center justify-center
      lg:mt-[0px] mt-[90px]'>
        <form action="" className='lg:w-[70%] w-[95%] lg:h-[70%] h-[100%]' onSubmit={onSubmitHandler}>
          <div className='py-[10px]'>
            <Title text1={"DELIVERY "} text2={"INFORMATION"} />
          </div>
          <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
            <input type="text" placeholder='First name' className='w-[48%] h-[50px] 
            rounded-md bg-slate-700 placeholder:text-[white] text-[18px] 
            px-[20px] shadow-sm shadow-[#343434] 'required onChange={onChangeHandler} name='firstName' value={formData.firstName} />

            <input type="text" placeholder='Last name' className='w-[48%] h-[50px] 
            rounded-md bg-slate-700 placeholder:text-[white] text-[18px] 
            px-[20px] shadow-sm shadow-[#343434] 'required onChange={onChangeHandler} name='lastName' value={formData.lastName} />
          </div>

          <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
            <input type="email" placeholder='Email Address' className='w-[100%] h-[50px] 
            rounded-md bg-slate-700 placeholder:text-[white] text-[18px] 
            px-[20px] shadow-sm shadow-[#343434] ' required onChange={onChangeHandler} name='email' value={formData.email} />
          </div>

          <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
            <input type="text" placeholder='Street' className='w-[100%] h-[50px] 
            rounded-md bg-slate-700 placeholder:text-[white] text-[18px] 
            px-[20px] shadow-sm shadow-[#343434] ' required onChange={onChangeHandler} name='street' value={formData.street} />
          </div>

          <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
            <input type="text" placeholder='City' className='w-[48%] h-[50px] 
            rounded-md bg-slate-700 placeholder:text-[white] text-[18px] 
            px-[20px] shadow-sm shadow-[#343434]' required onChange={onChangeHandler} name='city' value={formData.city} />

            <input type="text" placeholder='State' className='w-[48%] h-[50px] 
            rounded-md bg-slate-700 placeholder:text-[white] text-[18px] 
            px-[20px] shadow-sm shadow-[#343434]' required onChange={onChangeHandler} name='state' value={formData.state} />
          </div>

          <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
            <input type="text" placeholder='Pincode' className='w-[48%] h-[50px] 
            rounded-md bg-slate-700 placeholder:text-[white] text-[18px] 
            px-[20px] shadow-sm shadow-[#343434] ' required onChange={onChangeHandler} name='pincode' value={formData.pincode} />

            <input type="text" placeholder='Country' className='w-[48%] h-[50px] 
            rounded-md bg-slate-700 placeholder:text-[white] text-[18px] 
            px-[20px] shadow-sm shadow-[#343434]' required onChange={onChangeHandler} name='country' value={formData.country} />
          </div>

          <div className='w-[100%] h-[70px] flex items-center justify-between px-[10px]'>
            <input type="text" placeholder='Phone' className='w-[100%] h-[50px] 
            rounded-md bg-slate-700 placeholder:text-[white] text-[18px] 
            px-[20px] shadow-sm shadow-[#343434]'  required onChange={onChangeHandler} name='phone' value={formData.phone} />
          </div>
          <div>
            <button type='submit' className='text-[18px] active:bg-slate-500 cursor-pointer 
          bg-[#3bcee848] py-[10px] px-[50px] rounded-2xl text-white flex items-center 
          justify-center gap-[20px] absolute lg:right-[20%] bottom-[10%] right-[35%] border-[1px]
           border-[#80808049] ml-[30px] mt-[20px]'>PLACE ORDER</button>
          </div>

        </form>

      </div>
      <div className='lg:w-[50%] w-[100%] min-h-[100%] flex items-center justify-center gap-[30px]'>
        <div className='lg:w-[70%] w-[90%] lg:h-[70%] h-[100%] flex items-center justify-center 
        gap-[10px] flex-col'>
          <CartTotal />
          <div className='py-[10px]'>
            <Title text1={"PAYMENT "} text2={"METHOD"} />
          </div>

          <div className='w-[100%] h-[30vh] lg:h-[100px] flex items-start 
          mt-[20px] lg:mt-[0px] justify-center gap-[50px]'>
            <button onClick={() => setMethod('razorpay')} className={`w-[150px] h-[50px] 
              rounded-sm ${method === 'razorpay' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}>
              <img src={razorpay} className='w-[100%] h-[100%] object-fill rounded-sm' /> </button>

            <button onClick={() => setMethod('cod')} className={`w-[200px] h-[50px] bg-gradient-to-t
              from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f]
              font-bold ${method === 'cod' ? 'border-[5px] border-blue-900 rounded-sm' : ''}`}>CASH ON DELIVERY</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
