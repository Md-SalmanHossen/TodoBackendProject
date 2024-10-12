const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers["token-key"]; // Use req.headers

    if (!token) {
      return res.status(401).json({
        status: "unauthorized",
        message: "Token is required"
      });
    }

    // Verify token and attach user data to the request
    let dataVerify = await jwt.verify(token, "secret12345");

    // Attach the verified data to req.user
    req.user = dataVerify;

    // Extract username and add it to the request headers
    req.headers["username"] = dataVerify.data.userName; // Assuming userName is under data

    next(); // Call the next middleware
  } catch (err) {
    return res.status(401).json({ 
      status: "unauthorized", 
      message: "Token verification failed" 
    });
  }
};
