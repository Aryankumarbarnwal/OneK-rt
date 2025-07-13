import express from 'express'
import isAuth from '../middleware/isAuth.js'
import { allOrders, placeOrder, placeOrderRazorpay, updateStatus, userOrder, verifyRazorPay } from '../controller/orderController.js'
import adminAuth from '../middleware/adminAuth.js'

const orderRoutes = express.Router()


orderRoutes.post("/placeorder", isAuth,placeOrder)
orderRoutes.post("/razorpay", isAuth,placeOrderRazorpay)
orderRoutes.post("/userorder", isAuth,userOrder)
orderRoutes.post("/verifyrazorpay", isAuth,verifyRazorPay)

// for Admin 
orderRoutes.post("/list",adminAuth, allOrders )
orderRoutes.post("/status",adminAuth, updateStatus )

export default orderRoutes