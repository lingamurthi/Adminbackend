import {User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { check, validationResult } from "express-validator";
const registerUser=async(req,res)=>{
    const errors = validationResult(req);
    const {id,username, password } = req.body

    if (!errors.isEmpty()) {
        return res.status(422).json({
          error: errors.array()[0].msg
        });
      }
  

    const existedUser = await User.findOne({
        $or: [{ username }, { password }]
    })
    
    if (existedUser) {
        throw new ApiError(409, "User with username or password already exists")
    }

    const user = await User.create({
        f_sno:id,
        f_userName:username?.toLowerCase(),
        f_pwd:password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
}




const loginUser=async(req,res)=>{
    const errors = validationResult(req);
    

    if (!errors.isEmpty()) {
        return res.status(422).json({
          error: errors.array()[0].msg
        });
      }
    
    const generateAccessAndRefereshTokens = async(userId) =>{
        try {
            const user = await User.findById(userId)
            const accessToken =await user.generateAccessToken()
            const refreshToken =await user.generateRefreshToken()
    
            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })
    
            return {accessToken, refreshToken}
    
    
        } catch (error) {
            throw new ApiError(500, "Something went wrong while generating referesh and access token")
        }
    }
 // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {username,password}=req.body
   
  
    const user = await User.findOne({  $or: [{f_userName:username}, {f_pwd:password}]})

    
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
        }

        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

        const loggedInUser = await User.findById(user._id).select("-f_pwd -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        )

}



const logoutUser =async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
}

export {registerUser,loginUser,logoutUser}