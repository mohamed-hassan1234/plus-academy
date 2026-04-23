const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    whatsappNumber: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    educationLevel: {
        type: String,
        required: true,
        trim: true
    },
    institutionName: {
        type: String,
        required: true,
        trim: true
    },
    registrationNumber: {
        type: Number,
    },
    hasLaptop: {
        type: String,
        required: true,
        enum: ["Yes", "No"]
    },
    className: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Cancelled"],
        default: "Active"
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
