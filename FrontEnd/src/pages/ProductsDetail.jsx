import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ShopDataContext from '../context/ShopDataContext.jsx'
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from '../components/RelatedProduct.jsx';
import { toast } from 'react-toastify'

function ProductsDetail() {
  const { productId } = useParams();
  const { products, currency, addtoCart } = useContext(ShopDataContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = () => {
    const match = products.find(item => item._id === productId);
    if (match) {
      setProductData(match);
      setImage(match.image1);
    } else {
      console.log("Product not found");
    }
  };

  const handleAddToCart = async () => {
    if (!size) {
      toast.error("Please select a size before adding to cart!");
      return;
    }

    try {
      await addtoCart(productData._id, size);
      toast.success("Item added to cart!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add item to cart!");
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
    }
  }, [productId, products]);

  if (!productData) return <div className='text-white p-10'>Loading...</div>;

  return (
    <div className='w-full bg-gradient-to-l from-[#141414] to-[#0c2025] text-white pt-[80px] pb-[50px]'>

      {/* Main Product Section */}
      <div className='flex flex-col lg:flex-row gap-10 px-6 lg:px-16'>

        {/* Image Section */}
        <div className='lg:w-1/2 w-full flex flex-col lg:flex-row gap-6'>

          {/* Thumbnails */}
          <div className='flex lg:flex-col gap-3'>
            {[productData.image1, productData.image2, productData.image3, productData.image4].map((img, i) => (
              <div key={i} className='w-[60px] h-[60px] lg:w-[100px] lg:h-[110px] bg-slate-300 border cursor-pointer rounded-md'>
                <img src={img} alt="" className='w-full h-full object-cover rounded-md' onClick={() => setImage(img)} />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className='flex-1 border rounded-md overflow-hidden'>
            <img src={image} alt="Main Product" className='w-full object-contain rounded-md' />
          </div>
        </div>

        {/* Product Info */}
        <div className='lg:w-1/2 w-full flex flex-col gap-4'>
          <h1 className='text-[32px] font-bold'>{productData.name.toUpperCase()}</h1>

          {/* Rating */}
          <div className='flex items-center gap-1'>
            <FaStar className='text-[20px] fill-[#ffD700]' />
            <FaStar className='text-[20px] fill-[#ffD700]' />
            <FaStar className='text-[20px] fill-[#ffD700]' />
            <FaStar className='text-[20px] fill-[#ffD700]' />
            <FaStarHalfAlt className='text-[20px] fill-[#ffD700]' />
            <p className='text-[18px] pl-2'>(124)</p>
          </div>

          {/* Price */}
          <p className='text-[28px] font-semibold'>{currency} {productData.price}</p>

          {/* Description */}
          <p className='text-[16px]'>{productData.description}</p>

          {/* Size Selection */}
          <div className='mt-4'>
            <p className='text-[20px] font-semibold mb-2'>Select Size</p>
            <div className='flex gap-2 flex-wrap'>
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  className={`border py-2 px-4 rounded-md bg-slate-300 
                    ${item === size ? 'bg-black text-[#2f97f1] text-[18px]' : ''}`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <button
              className='bg-[#495b61c9] mt-4 px-5 py-2 rounded-2xl border border-[#80808049] text-white shadow-md'
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
          </div>

          {/* Policies */}
          <div className='mt-6 text-[14px] space-y-1'>
            <p>✅ 100% Original Product</p>
            <p>💸 Cash on delivery is available</p>
            <p>🔁 Easy return and exchange within 7 days</p>
          </div>
        </div>
      </div>

      {/* Description & Related */}
      <div className='mt-12 px-6 lg:px-16'>
        {/* Tabs */}
        <div className='flex gap-4 mb-3'>
          <button className='px-4 py-2 border text-sm'>Description</button>
          <button className='px-4 py-2 border text-sm'>Reviews (124)</button>
        </div>

        {/* Description Content */}
        <div className='bg-[#3336397c] border rounded-md p-5 text-[15px] leading-relaxed'>
          <p>
            Upgrade your wardrobe with this stylish slim-fit cotton shirt,
            available now on OneK@rt. Crafted from breathable, high-quality fabric,
            it offers all-day comfort and effortless style. Easy to maintain and perfect
            for any setting, this shirt is a must-have essential for those who value both
            fashion and function.
          </p>
        </div>

        {/* Related Products */}
        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </div>
    </div>
  );
}

export default ProductsDetail;
