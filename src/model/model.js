const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../../config");
const userSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String
    },
    class: {
        type: Number
    },
    collegeName: {
        type: String
    },
    rollNu: {
        type: Number
    },
    rollCode: {
        type: Number
    }
});
userSchema.statics.findByToken = async function (token) {
  try {
    const decodedToken = jwt.verify(token, secretKey);
    
    if (!decodedToken) {
      throw new Error("Invalid token");
    }
    
    const user = await this.findById(decodedToken.id);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  } catch (error) {
    throw error; 
  }
};
userSchema.methods.camparepassword = async function (interedpassword) {
    return bcrypt.campare(interedpassword,this.password)
}

const user = mongoose.model("user", userSchema);
module.exports={user}