import mongoose from "mongoose";


const employeeSchema=mongoose.Schema({
name:{
    type:String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true, 
    index: true
},
email: {
    type: String,
    required: true,
    unique: true,
    lowecase: true,
    trim: true, 
},
mobileNumber:{
    type: String,
    required: true,
    unique: true,
    lowecase: true,
    trim: true, 
},
designation:{
    type:String,
    required:true
},
gender:{
    type:String,
    required:true
},
course:{
    type:String,
    required:true
},
image:{
    type:String,
    required:true
}
},
{
    timestamps: true
})

export const Employee = mongoose.model("Employee", employeeSchema)

 