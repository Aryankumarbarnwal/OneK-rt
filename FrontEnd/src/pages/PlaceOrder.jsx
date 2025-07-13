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
        const {data} = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true })
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
          } else {
            toast.error(result.data.message || "Something went wrong while placing the order.");
          }
          break;
        }
        case 'razorpay': {
          const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true });
          if(resultRazorpay.data){
            initPay(resultRazorpay.data)
          }
          break;
        }
        default: break;
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col items-center justify-start py-[100px] px-4 overflow-y-auto'>
      <form className='w-full max-w-[700px] bg-[#1f1f1f] p-4 rounded-xl shadow-md border border-[#80808049]' onSubmit={onSubmitHandler}>
        <Title text1={"DELIVERY "} text2={"INFORMATION"} />
        <div className='flex gap-4 mb-4'>
          <input type="text" placeholder='First name' name='firstName' value={formData.firstName} onChange={onChangeHandler} required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md placeholder-white' />
          <input type="text" placeholder='Last name' name='lastName' value={formData.lastName} onChange={onChangeHandler} required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md placeholder-white' />
        </div>
        <input type="email" placeholder='Email Address' name='email' value={formData.email} onChange={onChangeHandler} required className='w-full h-[50px] bg-slate-700 text-white px-4 rounded-md mb-4 placeholder-white' />
        <input type="text" placeholder='Street' name='street' value={formData.street} onChange={onChangeHandler} required className='w-full h-[50px] bg-slate-700 text-white px-4 rounded-md mb-4 placeholder-white' />
        <div className='flex gap-4 mb-4'>
          <input type="text" placeholder='City' name='city' value={formData.city} onChange={onChangeHandler} required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md placeholder-white' />
          <input type="text" placeholder='State' name='state' value={formData.state} onChange={onChangeHandler} required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md placeholder-white' />
        </div>
        <div className='flex gap-4 mb-4'>
          <input type="text" placeholder='Pincode' name='pincode' value={formData.pincode} onChange={onChangeHandler} required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md placeholder-white' />
          <input type="text" placeholder='Country' name='country' value={formData.country} onChange={onChangeHandler} required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md placeholder-white' />
        </div>
        <input type="text" placeholder='Phone' name='phone' value={formData.phone} onChange={onChangeHandler} required className='w-full h-[50px] bg-slate-700 text-white px-4 rounded-md mb-6 placeholder-white' />
      </form>

      <div className='w-full max-w-[700px] mt-8'>
        <CartTotal />
      </div>

      <div className='w-full max-w-[700px] mt-8'>
        <Title text1={"PAYMENT "} text2={"METHOD"} />
        <div className='flex flex-col sm:flex-row items-center justify-center gap-6 mt-4'>
          <button onClick={() => setMethod('razorpay')} className={`w-[150px] h-[50px] ${method === 'razorpay' ? 'border-[3px] border-blue-900' : ''}`}>
            <img src={razorpay} className='w-full h-full object-contain rounded-sm' />
          </button>
          <button onClick={() => setMethod('cod')} className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-sm px-4 rounded-sm text-[#332f6f] font-bold ${method === 'cod' ? 'border-[3px] border-blue-900' : ''}`}>CASH ON DELIVERY</button>
        </div>
      </div>

      <button onClick={onSubmitHandler} className='mt-8 bg-[#3bcee848] text-white text-lg py-3 px-12 rounded-2xl border border-[#80808049] shadow-md hover:bg-[#3bcee8] transition duration-200'>PLACE ORDER</button>
    </div>
  )
}

export default PlaceOrder
