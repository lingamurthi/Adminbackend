import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {Employee} from "../models/employeeList.model.js"; 
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const employeeList=async(req,res)=>{

    const {name,email,mobileNumber,designation,gender,course}=req.body
    let empImgLocalpath;
  
    if(req.file)
    {
         empImgLocalpath=req.file?.path
    }

    
    if (!empImgLocalpath) {
        throw new ApiError(400, "Employee file is required")
    }

    const empImage = await uploadOnCloudinary(empImgLocalpath)

    if (!empImage) {
        throw new ApiError(400, "Error in the Cloudinary Website")
    }
    const newEmp=await Employee.create({
        name:name.toLowerCase(),
        email,
        mobileNumber,
        designation,
        gender,
        course,
        image:empImage?.url || ""
    })

    const createdEmp = await Employee.findById(newEmp._id)

    if (!createdEmp) {
        throw new ApiError(500, "Something went wrong while creating new employee")
    }

    return res.status(201).json(
        new ApiResponse(200, createdEmp, "New Employee registered Successfully")
    )
}

export {employeeList}