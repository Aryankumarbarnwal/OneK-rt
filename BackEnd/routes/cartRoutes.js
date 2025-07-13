import express from 'express'
import {addToCart, getUserCart, updateCart} from '../controller/cartController.js'
import isAuth from '../middleware/isAuth.js'

const cartRoutes = express.Router()

cartRoutes.post('/get', isAuth, getUserCart)
cartRoutes.post('/add',isAuth,addToCart)
cartRoutes.post('/update',isAuth,updateCart)

export default cartRoutes