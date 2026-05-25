const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async(req, res) => {
    const {username, email, password, role = "user"} = req.body;

    const isUserExist = await userModel.findOne({
        $or: [
            {usename: username},
            {email: email}
        ]
    })

    if(isUserExist){
        return res.status(400).json({
            message: "User already exists" 
        })
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,email,password:hashed,role
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, 
    {
        expiresIn: "7d"
    }
);

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
            message: "Login sucessfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
    })
}


const loginUser = async(req, res) => {
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, 
    {
        expiresIn: "7d"
    });

    res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
            message: "Login sucessfully",
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
    })

}



const logoutUser = async(req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logout successfully"
    })
}



const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            }
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


module.exports = {registerUser, loginUser, logoutUser, getMe};