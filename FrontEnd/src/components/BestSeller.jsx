import React, { useEffect, useState } from 'react'
import Title from './Title.jsx'
import { useContext } from 'react'
import ShopDataContext from '../context/ShopDataContext.jsx'
import Card from './Card.jsx'

function BestSeller() {

    let { products } = useContext(ShopDataContext)
    let [bestSeller, setBestSeller] = useState([])

    useEffect(()=>{
        let filterProduct = products.filter((item)=> item.bestseller)
        setBestSeller(filterProduct.slice(0,3));
    }, [products])

  return (
    <div>
        <div className='h-[8%] w-[100%] text-center mt-[50px] '>
        <Title text1={"BEST"} text2={"SELLER"}/>
        <p className='w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-blue-100'>
            Tried, Tested, Loved — Discover Our All-Time Best Sellers.
        </p>
    </div>
    <div className='w-[100%] h-[50%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px]'>
        {
            bestSeller.map((item, index)=>(
                <Card key={index} name={item.name} id={item._id}
                price={item.price} image={item.image1}/>
            ))
        }
    </div>
    </div>
  )
}

export default BestSeller