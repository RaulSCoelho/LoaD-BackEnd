const Joi = require('@hapi/joi')

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(20).required(),
        fullname: Joi.string().min(8).max(255).required(),
        email: Joi.string().min(10).max(255).required(),
        sex: Joi.string().min(1).max(6).required(),
        password: Joi.string().min(6).max(1024).required(),
        currentModule: Joi.number(),
        currentClass: Joi.number(),
        admin: Joi.boolean()
    })
    return schema.validate(data)
}

const patchValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(20),
        fullname: Joi.string().min(8).max(255),
        email: Joi.string().min(10).max(255).email(),
        password: Joi.string().min(6).max(1024),
        currentModule: Joi.number(),
        currentClass: Joi.number()
    })
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.patchValidation = patchValidation