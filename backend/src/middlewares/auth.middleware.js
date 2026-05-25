const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authAdmin = async(req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
                message: "Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "admin"){
            return res.status(401).json({
                message: "Only admin have access to this route"
            })
        }

        req.user = decoded;

        next();
    }
    catch(err){
        consol.log(err);    
        return res.status(401).json({message: "Unauthorized"});
    }

}


const authUser = async(req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
                message: "Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // if(decoded.role !== "user"){
        //     return res.status(401).json({
        //         message: "Only user have access to this route"
        //     })
        // }

        req.user = decoded;

        next();
    }
    catch(err){
        console.log(err);    
        return res.status(401).json({message: "Unauthorized"});
    }

}


module.exports = {authAdmin, authUser};