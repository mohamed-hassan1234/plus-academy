const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    registrationOpen: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
