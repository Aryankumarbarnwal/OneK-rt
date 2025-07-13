import React, { useState, useContext } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal.jsx';
import razorpay from '../assets/Razorpay.webp';
import ShopDataContext from '../context/ShopDataContext.jsx';
import AuthDataContext from '../context/AuthDataContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function PlaceOrder() {
  let [method, setMethod] = useState('cod');
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(ShopDataContext);
  let { serverUrl } = useContext(AuthDataContext);
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
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      handler: async function (response) {
        const { data } = await axios.post(serverUrl + '/api/order/verifyrazorpay', response, { withCredentials: true });
        if (data) {
          toast.success("🎉 Payment successful and order placed!");
          navigate("/order");
          setCartItem({});
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
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItem[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      if (method === 'cod') {
        const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true });
        if (result.data) {
          toast.success("🎉 Order placed successfully with Cash on Delivery!");
          setCartItem({});
          navigate("/order");
        } else {
          toast.error(result.data.message || "Something went wrong while placing the order.");
        }
      } else if (method === 'razorpay') {
        const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true });
        if (resultRazorpay.data) {
          initPay(resultRazorpay.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col md:flex-row gap-10 px-5 pt-24 pb-10 overflow-y-auto'>

      {/* Left Side - Delivery Form */}
      <div className='md:w-[55%] w-full'>
        <form className='w-full' onSubmit={onSubmitHandler}>
          <Title text1="DELIVERY" text2="INFORMATION" />

          {/* Input Fields */}
          <div className='flex flex-wrap gap-4 mt-6'>
            <input type="text" name="firstName" value={formData.firstName} onChange={onChangeHandler} required placeholder='First Name'
              className='flex-1 min-w-[48%] h-[50px] bg-slate-700 text-white px-4 rounded-md' />
            <input type="text" name="lastName" value={formData.lastName} onChange={onChangeHandler} required placeholder='Last Name'
              className='flex-1 min-w-[48%] h-[50px] bg-slate-700 text-white px-4 rounded-md' />
            <input type="email" name="email" value={formData.email} onChange={onChangeHandler} required placeholder='Email'
              className='w-full h-[50px] bg-slate-700 text-white px-4 rounded-md' />
            <input type="text" name="street" value={formData.street} onChange={onChangeHandler} required placeholder='Street'
              className='w-full h-[50px] bg-slate-700 text-white px-4 rounded-md' />
            <input type="text" name="city" value={formData.city} onChange={onChangeHandler} required placeholder='City'
              className='flex-1 min-w-[48%] h-[50px] bg-slate-700 text-white px-4 rounded-md' />
            <input type="text" name="state" value={formData.state} onChange={onChangeHandler} required placeholder='State'
              className='flex-1 min-w-[48%] h-[50px] bg-slate-700 text-white px-4 rounded-md' />
            <input type="text" name="pincode" value={formData.pincode} onChange={onChangeHandler} required placeholder='Pincode'
              className='flex-1 min-w-[48%] h-[50px] bg-slate-700 text-white px-4 rounded-md' />
            <input type="text" name="country" value={formData.country} onChange={onChangeHandler} required placeholder='Country'
              className='flex-1 min-w-[48%] h-[50px] bg-slate-700 text-white px-4 rounded-md' />
            <input type="text" name="phone" value={formData.phone} onChange={onChangeHandler} required placeholder='Phone'
              className='w-full h-[50px] bg-slate-700 text-white px-4 rounded-md' />
          </div>

          <button type='submit' className='mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700'>
            PLACE ORDER
          </button>
        </form>
      </div>

      {/* Right Side - Cart Total and Payment */}
      <div className='md:w-[45%] w-full flex flex-col items-center gap-6'>
        <CartTotal />

        <div className='w-full'>
          <Title text1="PAYMENT" text2="METHOD" />
          <div className='flex flex-col sm:flex-row items-center justify-between gap-5 mt-4'>

            {/* Razorpay */}
            <button
              onClick={() => setMethod('razorpay')}
              className={`w-full sm:w-[160px] h-[50px] rounded-sm overflow-hidden border ${method === 'razorpay' ? 'border-blue-800 border-[3px]' : 'border-transparent'}`}>
              <img src={razorpay} alt="razorpay" className='w-full h-full object-cover rounded-sm' />
            </button>

            {/* COD */}
            <button
              onClick={() => setMethod('cod')}
              className={`w-full sm:w-[200px] min-h-[50px] bg-gradient-to-t from-[#95b3f8] to-white text-[#332f6f] font-bold rounded-sm px-4 py-2 text-center
              ${method === 'cod' ? 'border-blue-800 border-[3px]' : 'border border-transparent'}`}>
              CASH ON DELIVERY
            </button>

          </div>
        </div>
      </div>

    </div>
  );
}

export default PlaceOrder;
