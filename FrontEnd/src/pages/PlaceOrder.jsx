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
    firstName: '', lastName:'', email: '', street: '', city: '', state: '', pincode: '', country: '', phone: ''
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
        const {data} = await axios.post(serverUrl + '/api/order/verifyrazorpay', response,{withCredentials:true})
        if(data){
          toast.success("\ud83c\udf89 Payment successful and order placed!");
          navigate("/order")
          setCartItem({})
        }
      },
      prefill: {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: '#3399cc' },
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
            toast.success("\ud83c\udf89 Order placed successfully with Cash on Delivery!");
            setCartItem({})
            navigate("/order")
          } else {
            toast.error(result.data.message || "Something went wrong while placing the order.");
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
        default: break;
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] px-4 py-[100px] flex flex-col md:flex-row gap-10'>
      {/* Form Section */}
      <div className='md:w-1/2 w-full'>
        <form onSubmit={onSubmitHandler} className='w-full space-y-5'>
          <Title text1={"DELIVERY "} text2={"INFORMATION"} />

          <div className='flex gap-4'>
            <input type="text" placeholder='First name' className='flex-1 h-[50px] rounded-md bg-slate-700 text-white px-4' required name='firstName' value={formData.firstName} onChange={onChangeHandler} />
            <input type="text" placeholder='Last name' className='flex-1 h-[50px] rounded-md bg-slate-700 text-white px-4' required name='lastName' value={formData.lastName} onChange={onChangeHandler} />
          </div>

          <input type="email" placeholder='Email Address' className='w-full h-[50px] rounded-md bg-slate-700 text-white px-4' required name='email' value={formData.email} onChange={onChangeHandler} />
          <input type="text" placeholder='Street' className='w-full h-[50px] rounded-md bg-slate-700 text-white px-4' required name='street' value={formData.street} onChange={onChangeHandler} />

          <div className='flex gap-4'>
            <input type="text" placeholder='City' className='flex-1 h-[50px] rounded-md bg-slate-700 text-white px-4' required name='city' value={formData.city} onChange={onChangeHandler} />
            <input type="text" placeholder='State' className='flex-1 h-[50px] rounded-md bg-slate-700 text-white px-4' required name='state' value={formData.state} onChange={onChangeHandler} />
          </div>

          <div className='flex gap-4'>
            <input type="text" placeholder='Pincode' className='flex-1 h-[50px] rounded-md bg-slate-700 text-white px-4' required name='pincode' value={formData.pincode} onChange={onChangeHandler} />
            <input type="text" placeholder='Country' className='flex-1 h-[50px] rounded-md bg-slate-700 text-white px-4' required name='country' value={formData.country} onChange={onChangeHandler} />
          </div>

          <input type="text" placeholder='Phone' className='w-full h-[50px] rounded-md bg-slate-700 text-white px-4' required name='phone' value={formData.phone} onChange={onChangeHandler} />

          <button type='submit' className='w-full mt-4 bg-[#3bcee848] py-3 text-white font-semibold rounded-md border border-[#80808049]'>PLACE ORDER</button>
        </form>
      </div>

      {/* Cart & Payment Section */}
      <div className='md:w-1/2 w-full flex flex-col items-center gap-6'>
        <CartTotal />

        <Title text1={"PAYMENT "} text2={"METHOD"} />

        <div className='flex gap-6 flex-wrap justify-center'>
          <button onClick={() => setMethod('razorpay')} className={`w-[150px] h-[50px] rounded-sm ${method === 'razorpay' ? 'border-4 border-blue-600' : ''}`}>
            <img src={razorpay} alt="razorpay" className='w-full h-full object-cover rounded-sm' />
          </button>

          <button onClick={() => setMethod('cod')} className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-white text-sm px-4 rounded-sm text-[#332f6f] font-bold ${method === 'cod' ? 'border-4 border-blue-600' : ''}`}>
            CASH ON DELIVERY
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
