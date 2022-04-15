const mongoose = require('mongoose')

const ModuleSchema = mongoose.Schema({
    module: {
        type: Number,
        required: true
    },
    videos: {
        type: Array,
        required: true,
    },
    titles: {
        type: Array,
        required: true
    },
    thumbnails: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model('Module', ModuleSchema)