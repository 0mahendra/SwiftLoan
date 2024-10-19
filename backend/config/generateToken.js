const jwt = require("jsonwebtoken");

const generateToken = (id) =>{
    return jwt.sign({id},"MahiSingh",{
        expiresIn:"30d",
    });
};

module.exports= generateToken;