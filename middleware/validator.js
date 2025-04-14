const joi = require("joi");

exports.registerStudentSchema = joi.object().keys({
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
//   username: joi.string().min(3).max(30).trim().pattern(/^[A-Za-z\s]+$/).required()
//   .messages({
//     'any.required': 'Username is required',
//     "string.empty": "Username cannot be empty",
//     "string.pattern.base": 'Username should only contain alphabets',
//     'string.min': 'Username should not be less than 3 letters'
// }),

confirmPassword: joi.string().trim()
.valid(joi.ref('password'))
.required()
.messages({
    "any.only": "Passwords do not match",
    'any.required': 'Confirm password is required'
}),

enrolledSubjects: joi.array().items(
  joi.string().valid(
    'English',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature in English',
    'Economics',
    'Geography',
    'Government',
    'History'
  )
),
});

exports.loginSchema = joi.object().keys({
  email: joi.string().trim().min(5).email().required()
  .messages({
    'string.email': "Invalid email format",
    "any.required": "Email is required"
}),
//   username: joi.string().min(3).max(30).trim().pattern(/^[A-Za-z\s]+$/).required()
//   .messages({
//     'any.required': 'Username is required',
//     "string.empty": "Username cannot be empty",
//     "string.pattern.base": 'Username should only contain alphabets',
//     'string.min': 'Username should not be less than 3 letters'
// }),
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

exports.changeStudentPasswordSchema = joi.object().keys({
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

exports.resetStudentPasswordSchema = joi.object().keys({
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
exports.updateStudentSchema = joi.object().keys({
  name: joi.string().trim().min(3).max(50).required()
  .messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must not be more than 50 characters long",
    "any.required": "Name is required"
  })

})
     


