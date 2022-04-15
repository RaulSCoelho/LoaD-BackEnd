const Joi = require('@hapi/joi')

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(20).required(),
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
        currentModule: Joi.number(),
        currentClass: Joi.number(),
        admin: Joi.boolean()
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation