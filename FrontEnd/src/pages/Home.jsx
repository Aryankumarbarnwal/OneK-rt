import React, { useEffect, useState } from 'react'
import Background from '../components/Background'
import Hero from '../components/Hero'
import Product from './Product.jsx'
import OurPolicy from '../components/OurPolicy.jsx'
import NewLetterBox from '../components/NewLetterBox.jsx'
import Footer from '../components/Footer.jsx'

function Home() {
  let heroData = [
    { text1: "30% OFF Limited offer", text2: "Style that" },
    { text1: "Discover the Best of Bold Fashion", text2: "Limited Time Only!" },
    { text1: "Explore Our Best Collection", text2: "Shop Now!" },
    { text1: "Choose your Perfect Fashion Fit", text2: "Now on Sale!" }
  ]

  let [heroCount, setHeroCount] = useState(0)

  useEffect(() => {
    let interval = setInterval(() => {
      setHeroCount((prevCount) => (prevCount === 3 ? 0 : prevCount + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-hidden relative top-[70px]">
      <div className="w-full min-h-screen flex flex-col md:flex-row flex-wrap">
        {/* Left side text */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative bg-gradient-to-l from-[#141414] to-[#162b30] text-white px-4 py-8">
          <Hero
            heroCount={heroCount}
            setHeroCount={setHeroCount}
            heroData={heroData[heroCount]}
          />
        </div>

        {/* Right side image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Background heroCount={heroCount} />
        </div>
      </div>
      <Product/>
      <OurPolicy/>
      <NewLetterBox/>
      <Footer/>
    </div>
  );
}

export default Home;
