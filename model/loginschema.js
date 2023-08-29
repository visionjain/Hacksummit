import mongoose, { Schema } from "mongoose";
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})
mongoose.models={}
module.exports = mongoose.models.User || mongoose.model('User', userSchema)