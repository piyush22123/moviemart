const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authAdmin = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(401).json({
        message: "Only admin have access to this route",
      });
    }

    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(403).json({
      message: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }
};

const authUser = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if(decoded.role !== "user"){
    //     return res.status(401).json({
    //         message: "Only user have access to this route"
    //     })
    // }

    req.user = decoded;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(403).json({
      message: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }
};

module.exports = { authAdmin, authUser };
