const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        min: 4,
        max: 20,
        required: true,
    },
    fullname: {
        type: String,
        min: 8,
        max: 255,
        required: true,
    },
    email: {
        type: String,
        min: 10,
        max: 255,
        required: true,
    },
    password: {
        type: String,
        min: 6,
        max: 1024,
        required: true,
    },
    currentModule: {
        type: Number,
        default: 0,
    },
    currentClass: {
        type: Number,
        default: 0,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('User', UserSchema)