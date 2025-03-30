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
