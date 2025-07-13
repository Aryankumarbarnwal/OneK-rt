import React, { useContext } from 'react'
import ai from '../assets/ai.png'
import ShopDataContext from '../context/ShopDataContext.jsx'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import open from '../assets/open.mp3'

function Ai() {
    const { showSearch, setShowSearch } = useContext(ShopDataContext)
    const navigate = useNavigate()
    let openingSound = new Audio(open)

    function speak(message) {
        const utterance = new SpeechSynthesisUtterance(message)
        window.speechSynthesis.speak(utterance)
    }

    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!speechRecognition) {
        toast.error("Your browser doesn't support speech recognition.")
        return null
    }

    const recognition = new speechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    let isRecognized = false // To track if speech was understood

    recognition.onresult = (e) => {
        isRecognized = true
        const transcript = e.results[0][0].transcript.trim().toLowerCase()
        console.log("🎤 Transcript:", transcript)

        if (transcript.includes("search") && transcript.includes("open") && !showSearch) {
            speak("Opening search")
            setShowSearch(true)
            navigate("/collections")
        }
        else if (transcript.includes("search") && transcript.includes("close") && showSearch) {
            speak("Closing search")
            setShowSearch(false)
        }
        else if (transcript.includes("collection") || transcript.includes("collections") || transcript.includes("products")) {
            speak("Opening collection page")
            navigate("/collections")
        }
        else if (transcript.includes("about")) {
            speak("Opening about page")
            navigate("/about")
            setShowSearch(false)
        }
        else if (transcript.includes("home")) {
            speak("Opening home page")
            navigate("/")
            setShowSearch(false)
        }
        else if (transcript.includes("cart") || transcript.includes("kaat") || transcript.includes("caat")) {
            speak("Opening your cart")
            navigate("/cart")
            setShowSearch(false)
        }
        else if (transcript.includes("contact")) {
            speak("Opening contact page")
            navigate("/contact")
            setShowSearch(false)
        }
        else if (transcript.includes("order")) {
            speak("Opening your orders page")
            navigate("/order")
            setShowSearch(false)
        }
        else {
            toast.error("Command not recognized. Please try again.")
        }
    }

    recognition.onend = () => {
        if (!isRecognized) {
            toast.warning("Didn't catch that. Please try again.")
        }
    }

    return (
        <div
            className='fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%] z-50'
            onClick={() => {
                isRecognized = false // Reset before starting recognition
                recognition.start()
                openingSound.play()
            }}
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
