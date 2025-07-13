import React, { useState, useContext } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal.jsx'
import razorpay from '../assets/Razorpay.webp'
import ShopDataContext from '../context/ShopDataContext.jsx'
import AuthDataContext from '../context/AuthDataContext.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function PlaceOrder() {

  const [method, setMethod] = useState('cod')
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(ShopDataContext)
  const { serverUrl } = useContext(AuthDataContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    street: '', city: '', state: '', pincode: '',
    country: '', phone: ''
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
        const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true })
        if (data) {
          toast.success("🎉 Payment successful and order placed!")
          setCartItem({})
          navigate("/order")
        }
      },
      prefill: {
        name: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: { color: '#3399cc' }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      let orderItems = []
      for (const itemId in cartItem) {
        for (const size in cartItem[itemId]) {
          if (cartItem[itemId][size] > 0) {
            const item = products.find(p => p._id === itemId)
            if (item) {
              orderItems.push({ ...item, size, quantity: cartItem[itemId][size] })
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      if (method === 'cod') {
        const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true })
        if (result.data) {
          toast.success("🎉 Order placed successfully with Cash on Delivery!")
          setCartItem({})
          navigate("/order")
        } else {
          toast.error(result.data.message || "Something went wrong while placing the order.")
        }
      } else if (method === 'razorpay') {
        const result = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true })
        if (result.data) {
          initPay(result.data)
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full min-h-[calc(100vh-120px)] pt-[70px] pb-[60px] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col md:flex-row gap-6 px-4 md:px-8 overflow-y-auto'>

      {/* Left - Form + Payment Method */}
      <div className='md:w-1/2 w-full'>
        <form onSubmit={onSubmitHandler} className='w-full'>
          <Title text1="DELIVERY" text2="INFORMATION" />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>

            <input type="text" placeholder="First name" name="firstName" required value={formData.firstName}
              onChange={onChangeHandler} className="input-style" />
            <input type="text" placeholder="Last name" name="lastName" required value={formData.lastName}
              onChange={onChangeHandler} className="input-style" />
            <input type="email" placeholder="Email" name="email" required value={formData.email}
              onChange={onChangeHandler} className="input-style col-span-1 sm:col-span-2" />
            <input type="text" placeholder="Street" name="street" required value={formData.street}
              onChange={onChangeHandler} className="input-style col-span-1 sm:col-span-2" />
            <input type="text" placeholder="City" name="city" required value={formData.city}
              onChange={onChangeHandler} className="input-style" />
            <input type="text" placeholder="State" name="state" required value={formData.state}
              onChange={onChangeHandler} className="input-style" />
            <input type="text" placeholder="Pincode" name="pincode" required value={formData.pincode}
              onChange={onChangeHandler} className="input-style" />
            <input type="text" placeholder="Country" name="country" required value={formData.country}
              onChange={onChangeHandler} className="input-style" />
            <input type="text" placeholder="Phone" name="phone" required value={formData.phone}
              onChange={onChangeHandler} className="input-style col-span-1 sm:col-span-2" />
          </div>

          {/* Payment Method Section */}
          <div className='mt-10'>
            <Title text1="PAYMENT" text2="METHOD" />
            <div className='flex flex-col sm:flex-row gap-6 mt-4 items-center'>
              <button type="button" onClick={() => setMethod('razorpay')}
                className={`w-full sm:w-[160px] h-[50px] rounded-sm overflow-hidden border
                ${method === 'razorpay' ? 'border-blue-700 border-[3px]' : 'border-transparent'}`}>
                <img src={razorpay} alt="razorpay" className='w-full h-full object-cover' />
              </button>

              <button type="button" onClick={() => setMethod('cod')}
                className={`w-full sm:w-[200px] min-h-[50px] bg-gradient-to-t from-[#95b3f8] to-white text-[#332f6f] font-bold rounded-md px-4 py-2 
                ${method === 'cod' ? 'border-blue-700 border-[3px]' : 'border border-transparent'}`}>
                CASH ON DELIVERY
              </button>
            </div>
          </div>

          <button type='submit' className='mt-8 w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700'>
            PLACE ORDER
          </button>
        </form>
      </div>

      {/* Right - Cart Total */}
      <div className='md:w-1/2 w-full'>
        <CartTotal />
      </div>
    </div>
  )
}

export default PlaceOrder
