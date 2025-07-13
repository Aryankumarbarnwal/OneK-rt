import { useNavigate } from 'react-router-dom'

function NotFound() {
  let navigate = useNavigate()

  return (
    <div className='w-full h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025]
    md:text-[70px] text-[30px] text-white flex flex-col items-center justify-center gap-6'>

      <p>404 Page Not Found</p>

      <button 
        className='bg-[white] px-[20px] py-[10px] rounded-xl 
        text-[18px] text-[black] hover:bg-slate-200 transition duration-300 cursor-pointer' 
        onClick={() => navigate("/login")}>
        Go to Login
      </button>
    </div>
  )
}

export default NotFound
