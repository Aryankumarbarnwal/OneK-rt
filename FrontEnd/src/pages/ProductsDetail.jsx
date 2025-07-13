import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShopDataContext from '../context/ShopDataContext.jsx';
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from '../components/RelatedProduct.jsx';
import { toast } from 'react-toastify';

function ProductsDetail() {
    const { productId } = useParams();
    const { products, currency, addtoCart } = useContext(ShopDataContext);
    const [productData, setProductData] = useState(null);

    const [image, setImage] = useState('');
    const [size, setSize] = useState('');

    useEffect(() => {
        if (products.length > 0) {
            const match = products.find(item => item._id === productId);
            if (match) {
                setProductData(match);
                setImage(match.image1);
            } else {
                console.log("Product not found");
            }
        }
    }, [productId, products]);

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

    if (!productData) return <div className="text-white p-10">Loading...</div>;

    return (
        <div className='w-full bg-gradient-to-l from-[#141414] to-[#0c2025] text-white pt-[80px] pb-[50px]'>
            {/* Top Section */}
            <div className='w-full flex flex-col lg:flex-row items-start justify-start gap-[30px] px-6 lg:px-16'>

                {/* Image Preview */}
                <div className='lg:w-[50%] w-full flex flex-col lg:flex-row gap-6'>
                    {/* Thumbnails */}
                    <div className='flex lg:flex-col gap-3'>
                        {[productData.image1, productData.image2, productData.image3, productData.image4].map((img, i) => (
                            <div key={i} className='w-[60px] h-[60px] lg:w-[100px] lg:h-[110px] bg-slate-300 rounded-md border cursor-pointer'>
                                <img src={img} alt="" className='w-full h-full object-cover rounded-md' onClick={() => setImage(img)} />
                            </div>
                        ))}
                    </div>
                    {/* Main Image */}
                    <div className='flex-1 border rounded-md overflow-hidden'>
                        <img src={image} alt="" className='w-full h-full object-contain rounded-md' />
                    </div>
                </div>

                {/* Product Info */}
                <div className='lg:w-[50%] w-full flex flex-col gap-4'>
                    <h1 className='text-[32px] font-bold'>{productData.name.toUpperCase()}</h1>
                    <div className='flex items-center gap-1'>
                        {[...Array(4)].map((_, i) => <FaStar key={i} className='text-yellow-400' />)}
                        <FaStarHalfAlt className='text-yellow-400' />
                        <span className='ml-2'>(124)</span>
                    </div>
                    <p className='text-[24px] font-semibold'>{currency} {productData.price}</p>
                    <p className='text-[16px] text-slate-200'>{productData.description}</p>

                    {/* Sizes */}
                    <div className='mt-4'>
                        <p className='text-lg font-medium mb-2'>Select Size</p>
                        <div className='flex gap-3'>
                            {productData.sizes.map((item, index) => (
                                <button key={index}
                                    onClick={() => setSize(item)}
                                    className={`px-4 py-2 rounded-md border bg-slate-300 ${item === size ? 'bg-black text-[#2f97f1]' : ''}`}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        className='mt-6 bg-[#495b61c9] border border-[#80808049] py-3 px-6 rounded-xl shadow-md'>
                        Add To Cart
                    </button>

                    {/* Info Notes */}
                    <div className='mt-6 text-sm space-y-1'>
                        <p>✔ 100% Original Product.</p>
                        <p>✔ Cash on delivery is available.</p>
                        <p>✔ Easy return & exchange within 7 days.</p>
                    </div>
                </div>
            </div>

            {/* Description & Related */}
            <div className='mt-[60px] px-6 lg:px-16'>
                <div className='flex gap-4 mb-3'>
                    <button className='px-4 py-2 border text-sm'>Description</button>
                    <button className='px-4 py-2 border text-sm'>Reviews (124)</button>
                </div>

                <div className='bg-[#3336397c] border rounded-md p-5 text-[15px] leading-relaxed'>
                    <p>
                        Upgrade your wardrobe with this stylish slim-fit cotton shirt, available now on OneK@rt.
                        Crafted from breathable, high-quality fabric, it offers all-day comfort and effortless style.
                        Easy to maintain and perfect for any setting, this shirt is a must-have essential for those who value both fashion and function.
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
