
const ProfileModel = require("../models/ProfileModel");

const jwt=require('jsonwebtoken');

exports.CreateProfile = async (req, res) => {
  try {

    let reqBody = req.body;
    const data = await ProfileModel.create(reqBody);
    res.status(200).json({
      status: "success",
      data: data,
    });

  } catch (err) {
    res.status(400).json({
      status: "fail",
      data: err.message,
    });
  }
};

//login user
exports.UserLogin = async (req, res) => {
  try {

    let userName = req.body.userName;
    let password = req.body.password;

    const data = await ProfileModel.find({
      userName: userName,
      Password: password,
    });

    if (data.length && data) {

      //create auth token
      let payLoad={
        exp: Math.floor(Date.now()/1000)+(24*60*60),
        data:0,
      }
      let token=jwt.sign(payLoad,'secret12345')

      res.status(200).json({
        status: "success",
        token:token,
        data: data,
      });

    } else {

      res.status(401).json({
        status: "fail",
        message: "Invalid username or password",
      });

    }
  } catch (err) {

    res.status(404).json({
      status: "fail",
      data: err.message,
    });

  }
};


//select profile
exports.SelectProfile = async (req, res) => {
  try {

    let userName = req.body.userName;

    const data = await ProfileModel.findOne({
      userName: userName,
    });

    if ( data) {

      res.status(400).json({
        status: "unauthorized",
        data: data,
      });

    } else {

      res.status(200).json({
        status: "success",
        data:data,
      });

    }
  } catch (err) {

    res.status(404).json({
      status: "fail",
      data: err.message,
    });

  }
};
