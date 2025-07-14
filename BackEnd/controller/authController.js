import { genToken, genToken1 } from "../config/token.js";
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";


export const registration = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await User.findOne({ email });
        if (existUser) {
            console.log("Registration failed: user already exists");
            toast.error("Password must be at least 8 characters long");
            return res.status(400).json({ message: "User already exist" });
        }
        if (!validator.isEmail(email)) {
            console.log("Registration failed: invalid email:", email);
            return res.status(400).json({ message: "Enter valid Email" });
        }
        if (password.length < 8) {
            console.log("Registration failed: password too short");
            return res.status(400).json({ message: "Enter Strong Password" });
        }

        let hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashPassword });
        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json(user)

    }
    catch (error) {
        console.log("registration error");
        return res.status(500).json({ message: `registration error ${error}` });
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User is not found" })
        }
        let isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json(user)
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        return res.status(200).json({ message: "logout succefully" });
    } catch (error) {
        console.error("LogOut error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



export const googleLogin = async (req, res) =>{
    try{
        let {name, email} = req.body;
        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                name, email
            })
        }

        let token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json(user)
        
    }
    catch(error){
        console.log("Google Login Error", error);
        return res.status(500).json({message:`googleLogin error ${error}`})
    }
}


export const adminLogin = async (req, res) =>{
    try {
        let {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            let token = await genToken1(email)
            res.cookie("adminToken",token,{
                httpOnly:true,
                secure:true,
                sameSite:"none",
                maxAge: 1 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json(token)
        }
        return res.status(400).json({message:"Invalid Credentials"})

    } catch (error) {
        console.log("AdminLogin error");
        return res.status(500).json({message:`AdminLogin error ${error}`})
    }
}
