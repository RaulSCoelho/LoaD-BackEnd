const Joi = require('@hapi/joi')

const addMessageValidation = data => {
    const schema = Joi.object({
        message: Joi.string().min(1).max(4096).required(),
        user: Joi.object().required(),
        day: Joi.string().required(),
        time: Joi.string().required(),
    })
    return schema.validate(data)
}

module.exports.addMessageValidation = addMessageValidation