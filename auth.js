
const jwt = require("jsonwebtoken");
const { secretKey } = require("./config");
module.exports = function (req, res, next) {
const token = req.header("x-auth-token"); 
if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, secretKey); 
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(400).json({ message: "Token is not valid" });
    }
};
