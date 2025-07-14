import React, { useContext } from 'react'
import ai from '../assets/ai.png'
import ShopDataContext from '../context/ShopDataContext.jsx'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import open from '../assets/open.mp3'

function Ai() {
  const { showSearch, setShowSearch } = useContext(ShopDataContext)
  const navigate = useNavigate()
  const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  const speak = (msg) => {
    const utterance = new SpeechSynthesisUtterance(msg)
    window.speechSynthesis.speak(utterance)
  }

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
    const openingSound = new Audio(open)

    recognition.onstart = () => {
      console.log("🎙 Voice recognition started")
      toast.info("Listening...")
    }

    recognition.onresult = (e) => {
      isRecognized = true
      const transcript = e.results[0][0].transcript.trim().toLowerCase()
      console.log("🎤 Transcript:", transcript)

      const match = (word) => transcript.includes(word)

      if (match("search") && match("open")) {
        speak("Opening search")
        setShowSearch(true)
        navigate("/collections")
      } else if (match("search") && match("close")) {
        speak("Closing search")
        setShowSearch(false)
      } else if (["collection", "collections", "products"].some(match)) {
        speak("Opening collection page")
        setShowSearch(false)
        navigate("/collections")
      } else if (match("about")) {
        speak("Opening about page")
        setShowSearch(false)
        navigate("/about")
      } else if (match("home")) {
        speak("Opening home page")
        setShowSearch(false)
        navigate("/")
      } else if (["cart", "kaat", "caat"].some(match)) {
        speak("Opening your cart")
        setShowSearch(false)
        navigate("/cart")
      } else if (match("contact")) {
        speak("Opening contact page")
        setShowSearch(false)
        navigate("/contact")
      } else if (match("order")) {
        speak("Opening your orders page")
        setShowSearch(false)
        navigate("/order")
      } else {
        toast.error("Command not recognized")
      }
    }

    recognition.onerror = (e) => {
      console.error("🎙 Speech error:", e.error)
      toast.error(`Error: ${e.error}`)
    }

    recognition.onend = () => {
      if (!isRecognized) {
        toast.warning("Didn't catch that. Try again.")
      }
    }

    // Play sound, then start listening
    openingSound.play().finally(() => {
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
