import React from 'react'
import Title from '../components/Title.jsx'
import AboutLogo2 from '../assets/AboutLogo2.png'
import NewLaterBox from '../components/NewLetterBox.jsx'

function About() {
  return (
    <div className='w-[98.85vw] min-h-[100vh] flex items-center justify-center 
    flex-col bg-gradient-to-l from-[#141414] to-[#0c2025] 
    gap-[50px] pt-[80px]'>
      
      <Title text1={"ABOUT "} text2={"US"} />

      <div className='lg:w-[70%] w-[100%] flex items-center justify-center flex-col lg:flex-row gap-[30px] '>

        {/* Image Section */}
        <div className='lg:w-[50%] w-[100%] flex items-center justify-center'>
          <img src={AboutLogo2} alt="About Logo" className='lg:w-[90%] w-[80%] shadow-md shadow-black rounded-sm' />
        </div>

        {/* Text Section */}
        <div className='lg:w-[50%] w-[80%] flex items-start justify-center gap-[20px] flex-col mt-[20px] lg:mt-[0px]'>

          <p className='lg:w-[80%] w-[100%] text-white md:text-[16px] text-[15px]'>
            OneK@rt was born for smart, seamless shopping — created to deliver quality products, 
            trending styles, and everyday essentials all in one place. 
            With reliable service, fast delivery, and great value, 
            OneK@rt makes your online shopping experience simple, satisfying,
            and stress-free.
          </p>

          <p className='lg:w-[80%] w-[100%] text-white md:text-[16px] text-[15px]'>
            We serve modern shoppers — combining style, convenience, and affordability.
             Whether it's fashion, essentials, or trending products, 
             we bring everything you need to one trusted platform with fast delivery,
              easy returns, and a customer-first experience you'll love.
          </p>

          <p className='lg:w-[80%] w-[100%] text-white text-[15px] lg:text-[18px] mt-[10px] font-bold'>
            Our Mission
          </p>

          <p className='lg:w-[80%] w-[100%] text-white md:text-[16px] text-[15px]'>
            To revolutionize the online shopping experience by providing top-quality products, 
            exceptional service, and unbeatable value — all under one roof. 
            We aim to make every purchase fast, affordable, and worry-free for our customers.
          </p>

        </div>
      </div>

      <div className='w-[100%] flex items-center justify-center flex-col gap-[10px]'>
        <Title text1={"WHY "} text2={"CHOOSE US"}/>

        <div className='w-[80%] flex items-center justify-center lg:flex-row
        flex-col py-[40px]'>

          <div className='lg:w-[33%] w-[90%] h-[250px] border-[1px] 
          border-gray-100 flex items-center justify-center gap-[20px] 
          flex-col px-[40px] py-[10px] text-[white] background-blur-[2px]
           bg-[#ffffff0b]'>
            <b className='text-[20px] font-semibold text-[#bff1f9]'>Quality Assurance</b>
            <p>We guarantee quality through strict checks, reliable sourcing, 
              and a commitment to customer satifaction always.</p>
           </div>
           <div className='lg:w-[33%] w-[90%] h-[250px] border-[1px] 
          border-gray-100 flex items-center justify-center gap-[20px] 
          flex-col px-[40px] py-[10px] text-[white] background-blur-[2px]
           bg-[#ffffff0b]'>
            <b className='text-[20px] font-semibold text-[#bff1f9]'>Convenience</b>
            <p>Shop easily with fast delivery, simple navigation, secure checkout, 
              and everything you need in one place.</p>
           </div>
           <div className='lg:w-[33%] w-[90%] h-[250px] border-[1px] 
          border-gray-100 flex items-center justify-center gap-[20px] 
          flex-col px-[40px] py-[10px] text-[white] background-blur-[2px]
           bg-[#ffffff0b]'>
            <b className='text-[20px] font-semibold text-[#bff1f9]'>Exceptional Customer Service</b>
            <p>Our dedicated support team ensures quick responses, 
              helpful solutions, and a smooth shopping experience every time.</p>
           </div>
        </div>
      </div>
      <NewLaterBox/>
    </div>
  )
}

export default About
