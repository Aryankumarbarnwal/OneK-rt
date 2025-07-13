import React, { useEffect, useState } from 'react'
import Title from './Title'
import { useContext } from 'react'
import ShopDataContext from '../context/ShopDataContext.jsx'
import Card from './Card.jsx'

function LatestCollection() {

    let { products } = useContext(ShopDataContext)
    let [latestProducts, setLatestProducts] = useState([])

    useEffect(() => {
        if (Array.isArray(products) && products.length > 0) {
            setLatestProducts(products.slice(0, 8));
        } else {
            setLatestProducts([]);
        }
    }, [products]);


    return (
        <div>
            <div className='h-[8%] w-[100%] text-center md:mt-[50px]'>
                <Title text1={"LATEST "} text2={"COLLECTIONS"} />
                <p className='w-[100%] m-auto text-[13px] md:text-[20px] 
            px-[10px] text-blue-100'>Step Into Style - New Collection Dropping This Season!</p>
            </div>

            <div className='w-[100%] h-[50%] mt-[30px] flex items-center
        justify-center flex-wrap gap-[50px]'>
                {
                    latestProducts.map((item, index) => (
                        <Card key={index} name={item.name} image={item.image1} id={item._id} price={item.price} />
                    ))
                }
            </div>
        </div>

    )
}

export default LatestCollection
