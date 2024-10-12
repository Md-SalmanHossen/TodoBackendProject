
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {

  let token = req.header["token-key"];
  let dataVerify = await jwt.verify(token, "secret12345");

  if (dataVerify) {
    res.status(401).json({ status: "unauthorized" });
  } else {
    next();
  }

};
