import { Employee } from "../models/employeeList.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getEmployeeList = async (req, res) => {
  try {
    const data = await Employee.find();
    
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
};

const getSingleEmployee = async (req, res) => {
  const employeeId = req.params.id;
  try {
    const data = await Employee.findById(employeeId);
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
};
export { getEmployeeList, getSingleEmployee };

const updateEmployee = async (req, res) => {
  const employeeId = req.params.id;

  const { name, email, mobileNumber, designation, gender, course } = req.body;
  let empImgLocalpath;

  if (req.file) {
    empImgLocalpath = req.file?.path;
  }
 

  if (!empImgLocalpath) {
    throw new ApiError(400, "Employee file is required");
  }

  const empImage = await uploadOnCloudinary(empImgLocalpath);

  if (!empImage) {
    throw new ApiError(400, "Error in the Cloudinary Website");
  }
 const updateddoc= await Employee.findByIdAndUpdate(
    employeeId,
    {
      name: name.toLowerCase(),
      email,
      mobileNumber,
      designation,
      gender,
      course,
      image: empImage?.url || "",
    },
    {
      new: true,
    }
  );

 

  return res
    .status(201)
    .json(
      new ApiResponse(200, updateddoc, "New Employee updated Successfully")
    );
};

export { updateEmployee };


const removeEmployee=async(req,res)=>{
try{
  const employeeId = req.params.id;
 
  const removedDocument=await Employee.findByIdAndDelete(employeeId)


  return res
  .status(200)
  .json(
    new ApiResponse(200, removedDocument, "Employee deleted Successfully")
  );
}
catch(error)
{
console.log(error);
}
}

export {removeEmployee}