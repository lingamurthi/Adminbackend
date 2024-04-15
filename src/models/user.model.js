import mongoose from "mongoose";

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema=mongoose.Schema({
f_sno:{
    type:Number,
    required: [true, 'Unique id is required'],
    unique: true
},
f_userName:{
    type:String,
    required: [true, 'Password is required'],
    lowercase: true,
    trim: true,
},
f_pwd:{
    type:String,
    required: [true, 'Password is required']
},
refreshToken: {
    type: String
}
},

{
    timestamps: true
}


)

userSchema.pre("save", async function (next) {
    if(!this.isModified("f_pwd")) return next();

    this.f_pwd = await bcrypt.hash(this.f_pwd, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(f_pwd){
    return await bcrypt.compare(f_pwd, this.f_pwd)
}


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            f_userName: this.f_userName,
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)

