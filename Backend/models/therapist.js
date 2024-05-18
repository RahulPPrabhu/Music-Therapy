const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
    therapistName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    specialization: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("Therapist", therapistSchema);