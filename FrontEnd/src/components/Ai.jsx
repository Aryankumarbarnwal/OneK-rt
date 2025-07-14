import React, { useContext } from 'react'
import ai from '../assets/ai.png'
import ShopDataContext from '../context/ShopDataContext.jsx'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import open from '../assets/open.mp3'

function Ai() {
  const { showSearch, setShowSearch } = useContext(ShopDataContext)
  const navigate = useNavigate()
  const openingSound = new Audio(open)

  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message)
    window.speechSynthesis.speak(utterance)
  }

  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!speechRecognition) {
    toast.error("Your browser doesn't support speech recognition.")
    return null
  }

  const handleVoiceCommand = () => {
  const recognition = new speechRecognition()
  recognition.continuous = false
  recognition.interimResults = false
  recognition.lang = 'en-US'

  let isRecognized = false

  recognition.onstart = () => {
    console.log("🎙 Voice recognition started");
    toast.info("Listening...");
  }

  recognition.onresult = (e) => {
    isRecognized = true
    const transcript = e.results[0][0].transcript.trim().toLowerCase()
    console.log("🎤 Transcript:", transcript)

    const commandMatched = (phrase) => transcript.includes(phrase)

    if (commandMatched("search") && commandMatched("open") && !showSearch) {
      speak("Opening search")
      setShowSearch(true)
      navigate("/collections")
    } else if (commandMatched("search") && commandMatched("close") && showSearch) {
      speak("Closing search")
      setShowSearch(false)
    } else if (["collection", "collections", "products"].some(commandMatched)) {
      speak("Opening collection page")
      setShowSearch(false)
      navigate("/collections")
    } else if (commandMatched("about")) {
      speak("Opening about page")
      setShowSearch(false)
      navigate("/about")
    } else if (commandMatched("home")) {
      speak("Opening home page")
      setShowSearch(false)
      navigate("/")
    } else if (["cart", "kaat", "caat"].some(commandMatched)) {
      speak("Opening your cart")
      setShowSearch(false)
      navigate("/cart")
    } else if (commandMatched("contact")) {
      speak("Opening contact page")
      setShowSearch(false)
      navigate("/contact")
    } else if (commandMatched("order")) {
      speak("Opening your orders page")
      setShowSearch(false)
      navigate("/order")
    } else {
      toast.error("Command not recognized. Please try again.")
    }
  }

  recognition.onerror = (e) => {
    console.error("SpeechRecognition error:", e.error)
    toast.error(`Error: ${e.error}`)
  }

  recognition.onend = () => {
    if (!isRecognized) {
      toast.warning("Didn't catch that. Please try again.")
    } else {
      console.log("🎙 Voice recognition ended")
    }
  }

  // Play sound THEN start recognition
  openingSound.play().then(() => {
    recognition.start()
  }).catch(() => {
    recognition.start()
  })
}


  return (
    <div
      className='fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%] z-50'
      onClick={handleVoiceCommand}
    >
      <img
        src={ai}
        alt="AI Assistant"
        className="w-[80px] md:w-[90px] lg:w-[100px] cursor-pointer 
                   rounded-full border-[3px] border-[#00bcd4] 
                   shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 
                   hover:scale-110 animate-bounce"
      />
    </div>
  )
}

export default Ai
