const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        childName: {
            type: String,
            required: true,
            trim: true
        },
        dateOfBirth: {
            type: Date,
        },

        parentGuardianName :{
            type: String,
             required: true,
        },

        PhoneNumber:{
            type: Number,
             required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        programApplyingFor:{
            type:String,
            required:true,
            enum:[
                "Play School",
                "Nursery",
                "LKG",
                "UKG"
            ]
        },

        notes:{
            type:String,
            default:""
        },
        password:{
            type: String,
             required: true,
        },
        role:{
            type: String,
            enum:["Admin","Parent"],
            default: "Admin"
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
