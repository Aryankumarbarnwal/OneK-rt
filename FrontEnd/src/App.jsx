import { Routes , Route, useLocation, Navigate} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Nav from './components/Nav'
import { useContext } from 'react'
import UserDataContext from './context/UserDataContext'
import About from './pages/About'
import Collections from './pages/Collections'
import Product from './pages/Product'
import Contact from './pages/Contact'
import ProductsDetail from './pages/ProductsDetail'
import Cart from './pages/Cart.jsx'
import PlaceOrder from './pages/PlaceOrder.jsx'
import Order from './pages/Order.jsx'
import NotFound from './pages/NotFound.jsx'
import { ToastContainer} from 'react-toastify';
import Ai from './components/Ai.jsx'
import axios from 'axios'  // 👈 Step 1: Axios import
axios.defaults.withCredentials = true  // ✅ Step 2: Enable credentials globally

function App() {
  let {userData} = useContext(UserDataContext);
  let location  = useLocation()

  return (
    <>
    <ToastContainer />
    {userData && <Nav/>}
      <Routes>
        <Route path='/login' 
        element= { userData ? (<Navigate to={location.state?.from || "/"}/>) 
                : (<Login/>)
                } />

        <Route path='/' 
        element={userData ? <Home/> : <Navigate to="/login" state={{from:location.pathname}} /> } />
        
        <Route path='/signup' 
        element={userData ? (<Navigate to={location.state?.from || "/"}/>) 
                : (<Registration/>)}/>

        <Route path='/about' 
        element={userData ? <About/> : <Navigate to="/login" state={{from:location.pathname}} /> }/>

        <Route path='/collections' 
        element={userData ? <Collections/> : <Navigate to="/login" state={{from:location.pathname}} /> }/>

        <Route path='/product' 
        element={userData ? <Product/> : <Navigate to="/login" state={{from:location.pathname}} /> }/>

        <Route path='/contact' 
        element={userData ? <Contact/> : <Navigate to="/login" state={{from:location.pathname}} /> }/>

        <Route path='/productdetail/:productId' 
        element={userData ? <ProductsDetail/> : <Navigate to="/login" state={{from:location.pathname}} /> }/>

        <Route path='/cart' 
        element={userData ? <Cart/> : <Navigate to="/login" state={{from:location.pathname}} /> }/>

        <Route path='/placeorder' 
        element={userData ? <PlaceOrder/> : <Navigate to="/login" state={{from:location.pathname}} /> }/>

        <Route path='/order' 
        element={userData ? <Order/> : <Navigate to="/login" state={{from:location.pathname}} /> }/>

        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Ai/>
    </>
  )
}

export default App
