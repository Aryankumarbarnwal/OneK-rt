import mongoose from "mongoose";
const connectDb = async () =>{
    try{
        await mongoose.connect(process.env.MongoDB_URL);
        console.log("DB connected")
    }catch(error){
        console.log("DB Error")
    }

}

export default connectDb