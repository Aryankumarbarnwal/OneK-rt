import React from 'react'
import { FaCircle } from "react-icons/fa";

function Hero({ heroData, heroCount, setHeroCount }) {
  return (
    <div className="flex flex-col justify-center items-start gap-6 px-6 py-10 w-full h-full">
      <div className="text-[#88d9ee] text-2xl md:text-3xl lg:text-4xl font-semibold">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      <div className="flex items-center gap-3">
        {[0,1,2,3].map((i)=>(
          <FaCircle
            key={i}
            className={`w-4 h-4 cursor-pointer ${
              heroCount === i ? "fill-orange-400" : "fill-white"
            }`}
            onClick={()=>setHeroCount(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero
