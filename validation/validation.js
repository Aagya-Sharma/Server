const joi = require('joi')

const schema = joi.object({
    firstName: joi.string()
               .max(25)
               .min(2)
               .required(true)
               .trim(true),

    lastName: joi.string()
              .max(25)
              .min(2)
              .required(true)
              .trim(true),

    email: joi.string()
           .max(255)
           .email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),

    password: joi.string()
              .pattern(new RegExp('^[a-zA-Z0-9]{10,30}$')),

    confirmPassword: joi.ref('password'),

    verified: joi.boolean()
              .default(false),

    role: joi.string()
          .valid('admin', 'psych', 'patient')
          .lowercase(true)
})


const userValidation = async(req, res, next) => {
    const response = req.body
    const {error} = schema.validate(response)
    if(!error){
        next()
    }else {
       return res.json({message: error.message})
    }
}

module.exports = userValidation
