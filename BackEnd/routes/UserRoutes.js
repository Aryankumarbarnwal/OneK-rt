import express from "express";
import {getAdmin, getCurrentUser}  from "../controller/UserController.js";
import isAuth from "../middleware/isAuth.js";
import adminAuth from "../middleware/adminAuth.js";

let userRoutes = express.Router();

userRoutes.get("/getcurrentuser", isAuth, getCurrentUser);
userRoutes.get("/getadmin", adminAuth, getAdmin);



export default userRoutes;
