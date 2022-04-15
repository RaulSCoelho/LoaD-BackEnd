const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        min: 4,
        max: 20,
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
        type: String,
        default: "https://www.youtube.com/embed/bn3XrkDaqYE",
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