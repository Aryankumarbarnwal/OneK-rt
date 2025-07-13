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

  let [method, setMethod] = useState('cod');
  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } = useContext(ShopDataContext);
  let { serverUrl } = useContext(AuthDataContext);
  let navigate = useNavigate();

  let [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '', city: '',
    state: '', pincode: '', country: '', phone: ''
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
      theme: { color: '#3399cc' },
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

      switch (method) {
        case 'cod': {
          const result = await axios.post(serverUrl + "/api/order/placeorder", orderData, { withCredentials: true });
          if (result.data) {
            toast.success("🎉 Order placed successfully with Cash on Delivery!");
            setCartItem({});
            navigate("/order");
          } else {
            toast.error(result.data.message || "Something went wrong while placing the order.");
          }
          break;
        }

        case 'razorpay': {
          const resultRazorpay = await axios.post(serverUrl + "/api/order/razorpay", orderData, { withCredentials: true });
          if (resultRazorpay.data) {
            initPay(resultRazorpay.data);
          }
          break;
        }

        default: break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] 
    flex flex-col md:flex-row items-start justify-center gap-[30px] pt-[80px] pb-[40px] px-3'>

      {/* Delivery Info */}
      <div className='md:w-[50%] w-full'>
        <form onSubmit={onSubmitHandler} className='w-full flex flex-col gap-3'>
          <Title text1={"DELIVERY "} text2={"INFORMATION"} />

          <div className='flex gap-3'>
            <input type="text" name="firstName" placeholder="First Name"
              className='flex-1 h-[45px] rounded-md bg-slate-700 placeholder:text-white px-4 text-[16px]'
              required value={formData.firstName} onChange={onChangeHandler} />
            <input type="text" name="lastName" placeholder="Last Name"
              className='flex-1 h-[45px] rounded-md bg-slate-700 placeholder:text-white px-4 text-[16px]'
              required value={formData.lastName} onChange={onChangeHandler} />
          </div>

          <input type="email" name="email" placeholder="Email"
            className='w-full h-[45px] rounded-md bg-slate-700 placeholder:text-white px-4 text-[16px]'
            required value={formData.email} onChange={onChangeHandler} />

          <input type="text" name="street" placeholder="Street"
            className='w-full h-[45px] rounded-md bg-slate-700 placeholder:text-white px-4 text-[16px]'
            required value={formData.street} onChange={onChangeHandler} />

          <div className='flex gap-3'>
            <input type="text" name="city" placeholder="City"
              className='flex-1 h-[45px] rounded-md bg-slate-700 placeholder:text-white px-4 text-[16px]'
              required value={formData.city} onChange={onChangeHandler} />
            <input type="text" name="state" placeholder="State"
              className='flex-1 h-[45px] rounded-md bg-slate-700 placeholder:text-white px-4 text-[16px]'
              required value={formData.state} onChange={onChangeHandler} />
          </div>

          <div className='flex gap-3'>
            <input type="text" name="pincode" placeholder="Pincode"
              className='flex-1 h-[45px] rounded-md bg-slate-700 placeholder:text-white px-4 text-[16px]'
              required value={formData.pincode} onChange={onChangeHandler} />
            <input type="text" name="country" placeholder="Country"
              className='flex-1 h-[45px] rounded-md bg-slate-700 placeholder:text-white px-4 text-[16px]'
              required value={formData.country} onChange={onChangeHandler} />
          </div>

          <input type="text" name="phone" placeholder="Phone"
            className='w-full h-[45px] rounded-md bg-slate-700 placeholder:text-white px-4 text-[16px]'
            required value={formData.phone} onChange={onChangeHandler} />

          <button type="submit" className='text-[15px] mt-4 w-fit mx-auto bg-[#3bcee848] px-8 py-2 
          rounded-xl text-white hover:bg-[#3bcee8] transition-all duration-300'>
            PLACE ORDER
          </button>
        </form>
      </div>

      {/* Order Summary + Payment */}
      <div className='md:w-[40%] w-full flex flex-col gap-6'>
        <CartTotal />
        <div className='pt-2'>
          <Title text1={"PAYMENT "} text2={"METHOD"} />
        </div>

        <div className='flex flex-wrap gap-4 mt-2 items-center'>
          <button onClick={() => setMethod('razorpay')} className={`w-[140px] h-[45px] 
            rounded-md overflow-hidden border-2 ${method === 'razorpay' ? 'border-blue-500' : 'border-transparent'}`}>
            <img src={razorpay} alt="Razorpay" className='w-full h-full object-cover' />
          </button>

          <button onClick={() => setMethod('cod')} className={`w-[160px] h-[45px] bg-gradient-to-t 
            from-[#95b3f8] to-white text-sm px-4 py-2 rounded-md text-[#332f6f] font-semibold 
            ${method === 'cod' ? 'border-2 border-blue-500' : ''}`}>
            CASH ON DELIVERY
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
