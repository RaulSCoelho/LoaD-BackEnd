const Joi = require('@hapi/joi')

const addModuleValidation = data => {
    const schema = Joi.object({
        module: Joi.number().required(),
        videos: Joi.array().required(),
        titles: Joi.array().required(),
        thumbnails: Joi.array().required(),
    })
    return schema.validate(data)
}

const patchModuleValidation = data => {
    const schema = Joi.object({
        module: Joi.number(),
        videos: Joi.array(),
        titles: Joi.array(),
        thumbnails: Joi.array(),
    })
    return schema.validate(data)
}

module.exports.addModuleValidation = addModuleValidation
module.exports.patchModuleValidation = patchModuleValidation