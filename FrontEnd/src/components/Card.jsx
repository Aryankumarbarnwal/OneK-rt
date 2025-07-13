import { useContext } from 'react'
import ShopDataContext from '../context/ShopDataContext.jsx'
import { useNavigate } from 'react-router-dom'

function Card({name, image, id, price}) {

    let {currency} = useContext(ShopDataContext)
    let navigate = useNavigate()

  return (
    <div className='w-[300px] max-w-[90%] h-[500px] bg-[#ffffff0a]
    backdrop:blur-lg rounded-lg hover:scale-[102%] flex items-start justify-start flex-col 
    p-[10px] cursor-pointer border-[1px] border-[#80808049]' onClick={()=>navigate(`/productdetail/${id}`)}>
    
        <img src={image} alt="" className='w-[100%] h-[80%] rounded-sm object-cover'/>
        <div className='text-[#c3f6fa] text-[18px] py-[10px]'>{name}</div>
        <div className='text-[#f3fafa] text-[14px]'>{currency}{price}</div>

    </div>
  )
}

export default Card