import { Route,Routes } from "react-router-dom"
import Home from "./pages/Home"
import Lists from "./pages/Lists"
import Login from "./pages/Login"
import Add from "./pages/Add"
import Order from "./pages/Order"
import { useContext } from "react"
import { ToastContainer } from 'react-toastify';
import AdminDataContext from "./context/AdminDataContext.jsx"

function App() {
  let {adminData} = useContext(AdminDataContext)

  return (
    <> 
    <ToastContainer />
      {!adminData ? <Login/> :
      <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/add" element={<Add/>}/>
        <Route path="/lists" element={<Lists/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/orders" element={<Order/>}/>
      </Routes>
      </>
      }
    </>
  )
}

export default App
