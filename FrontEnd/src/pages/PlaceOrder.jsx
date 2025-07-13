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
    lastName: '',
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
        const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay',
          response, { withCredentials: true })
        if (data) {
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

          if (result.data) {
            toast.success("🎉 Order placed successfully with Cash on Delivery!");
            setCartItem({})
            navigate("/order")
          } else {
            toast.error(result.data.message || "Something went wrong while placing the order.");
            console.log(result.data.message)
          }
          break;
        }

        case 'razorpay': {
          const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true });

          if (resultRazorpay.data) {
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
    <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] 
    overflow-y-auto flex flex-col md:flex-row items-start justify-center gap-[30px] 
    pt-[80px] pb-[40px] px-3'>

      {/* Form Section */}
      <div className='lg:w-[50%] w-full flex items-center justify-center'>
        <form className='w-full max-w-[600px] flex flex-col gap-5' onSubmit={onSubmitHandler}>
          <Title text1={"DELIVERY "} text2={"INFORMATION"} />

          <div className='flex gap-3'>
            <input type="text" name='firstName' required value={formData.firstName} onChange={onChangeHandler}
              placeholder='First Name' className='w-1/2 h-[50px] px-4 rounded-md bg-slate-700 text-white' />
            <input type="text" name='lastName' required value={formData.lastName} onChange={onChangeHandler}
              placeholder='Last Name' className='w-1/2 h-[50px] px-4 rounded-md bg-slate-700 text-white' />
          </div>

          <input type="email" name='email' required value={formData.email} onChange={onChangeHandler}
            placeholder='Email' className='w-full h-[50px] px-4 rounded-md bg-slate-700 text-white' />

          <input type="text" name='street' required value={formData.street} onChange={onChangeHandler}
            placeholder='Street' className='w-full h-[50px] px-4 rounded-md bg-slate-700 text-white' />

          <div className='flex gap-3'>
            <input type="text" name='city' required value={formData.city} onChange={onChangeHandler}
              placeholder='City' className='w-1/2 h-[50px] px-4 rounded-md bg-slate-700 text-white' />
            <input type="text" name='state' required value={formData.state} onChange={onChangeHandler}
              placeholder='State' className='w-1/2 h-[50px] px-4 rounded-md bg-slate-700 text-white' />
          </div>

          <div className='flex gap-3'>
            <input type="text" name='pincode' required value={formData.pincode} onChange={onChangeHandler}
              placeholder='Pincode' className='w-1/2 h-[50px] px-4 rounded-md bg-slate-700 text-white' />
            <input type="text" name='country' required value={formData.country} onChange={onChangeHandler}
              placeholder='Country' className='w-1/2 h-[50px] px-4 rounded-md bg-slate-700 text-white' />
          </div>

          <input type="text" name='phone' required value={formData.phone} onChange={onChangeHandler}
            placeholder='Phone Number' className='w-full h-[50px] px-4 rounded-md bg-slate-700 text-white' />

          <button type="submit" className='text-[15px] mt-6 w-full bg-[#3bcee848] px-6 py-3 
          rounded-xl text-white hover:bg-[#3bcee8] transition-all duration-300'>
            PLACE ORDER
          </button>
        </form>
      </div>

      {/* Cart Total & Payment Section */}
      <div className='lg:w-[40%] w-full flex flex-col items-center justify-center gap-6 px-3'>
        <CartTotal />
        <Title text1={"PAYMENT "} text2={"METHOD"} />

        <div className='w-full flex flex-col md:flex-row items-center justify-center gap-5'>
          <button onClick={() => setMethod('razorpay')} className={`w-[150px] h-[50px] rounded-sm 
            ${method === 'razorpay' ? 'border-[5px] border-blue-900' : ''}`}>
            <img src={razorpay} alt="razorpay" className='w-full h-full object-fill rounded-sm' />
          </button>

          <button onClick={() => setMethod('cod')} className={`w-[200px] h-[50px] bg-gradient-to-t
            from-[#95b3f8] to-[white] text-[14px] px-[20px] rounded-sm text-[#332f6f]
            font-bold ${method === 'cod' ? 'border-[5px] border-blue-900' : ''}`}>
            CASH ON DELIVERY
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
