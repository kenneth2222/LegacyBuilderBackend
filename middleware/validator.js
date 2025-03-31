<<<<<<< HEAD
const joi =require("joi")

exports.registerUserSchema = joi.object().keys({
    fullName: joi.string().min(3).max(40).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required(),
    username: joi.string().min(3).max(30).required(),

})

exports.loginSchema = joi.object().keys({
    username: joi.string().min(3).max(30).required(),
    password: joi.string().trim().required()
})
 exports.forgotPasswordSchema = joi.object().keys({
    email: joi.string().trim().min(5).max(50).email().required(),
      
});
=======
const joi = require("joi");

exports.registerUserSchema = joi.object().keys({
  fullName: joi.string().min(3).trim().pattern(/^[A-Za-z\s]+$/).required()
  .messages({
    'any.required': 'Fullname is required',
    "string.empty": "Fullname cannot be empty",
    "string.pattern.base": 'Fullname should only contain alphabets',
    'string.min': 'Fullname should not be less than 3 letters'
}),
  email: joi.string().trim().email().required()
  .messages({
    'string.email': "Invalid email format",
    "any.required": "Email is required"
}),
  password: joi.string().trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
  .messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]"
}),
  username: joi.string().min(3).max(30).trim().pattern(/^[A-Za-z\s]+$/).required()
  .messages({
    'any.required': 'Username is required',
    "string.empty": "Username cannot be empty",
    "string.pattern.base": 'Username should only contain alphabets',
    'string.min': 'Username should not be less than 3 letters'
}),

confirmPassword: joi.string().trim()
.valid(joi.ref('password'))
.required()
.messages({
    "any.only": "Passwords do not match",
    'any.required': 'Confirm password is required'
})
});

exports.loginSchema = joi.object().keys({
  username: joi.string().min(3).max(30).trim().pattern(/^[A-Za-z\s]+$/).required()
  .messages({
    'any.required': 'Username is required',
    "string.empty": "Username cannot be empty",
    "string.pattern.base": 'Username should only contain alphabets',
    'string.min': 'Username should not be less than 3 letters'
}),
  password: joi.string().trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
  .messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]"
}),
});


exports.forgotPasswordSchema = joi.object().keys({
  email: joi.string().trim().min(5).email().required()
  .messages({
    'string.email': "Invalid email format",
    "any.required": "Email is required"
}),
});

exports.changeUserPasswordSchema = joi.object().keys({
  currentPassword: joi.string().trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
  .messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]"
}),
  newPassword: joi.string().trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required()
  .messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]"
}),

    confirmPassword: joi.string().trim()
    .valid(joi.ref('newPassword'))
    .required()
    .messages({
        "any.only": "Passwords do not match",
        'any.required': 'Confirm password is required'
    })
});


>>>>>>> 32eb3dcb36906562f2803f0370898fe2e718ca1e
