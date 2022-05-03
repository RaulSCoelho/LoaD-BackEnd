const mongoose = require('mongoose')

const ChatSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Chat', ChatSchema)