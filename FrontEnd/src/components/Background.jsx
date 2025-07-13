import React from 'react'
import black1 from "../assets/black1.webp"
import black2 from "../assets/black2.jpg"
import black3 from "../assets/black3.jpg"
import black4 from "../assets/black4.jpg"

function Background({heroCount}) {
  let imageSrc;
  if(heroCount === 0) imageSrc = black1;
  else if(heroCount === 1) imageSrc = black2;
  else if(heroCount === 2) imageSrc = black3;
  else imageSrc = black4;

  return (
    <img
      src={imageSrc}
      alt=""
      className="w-full h-full object-cover"
    />
  )
}

export default Background
