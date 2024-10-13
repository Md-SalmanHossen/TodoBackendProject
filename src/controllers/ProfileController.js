
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

// const bcrypt=require('bcrypt');
exports.UserLogin = async (req, res) => {
    try {
      let userName = req.body.userName;
      let password = req.body.password;  // Ensure password is being received correctly
  
      const data = await ProfileModel.find({
        userName: userName,
        Password: password,  // Ensure this matches your database field name
      });
  
      if (data.length && data) {
        // Create auth token
        let payLoad = {
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
          data: {
            userName: userName,
          },
        };
        
        let token = jwt.sign(payLoad, 'secret12345');
  
        res.status(200).json({
          status: "success",
          token: token,
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
      const userName = req.user.data.userName; // Ensure this is correct
      console.log("Username from Token:", userName); // Log the username
  
      const data = await ProfileModel.findOne({
        userName: userName,
      });
  
      if (data) {
        res.status(200).json({
          status: "success",
          data: data,
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }
    } catch (err) {
      res.status(500).json({
        status: "fail",
        message: err.message,
      });
    }
};


//update profile
exports.UpdateProfile = async (req, res) => {
  try {
    // Get the username from the decoded token (via middleware)
    let userName = req.user.data.userName;

    // Get the data from the request body that will be used for updating
    let reqBody = req.body;

    // Update the profile with the new data
    const data = await ProfileModel.findOneAndUpdate(
      { userName: userName }, // Filter condition
      reqBody,                // New data for update
      { new: true }           // Return the updated document
    );

    if (data) {
      res.status(200).json({
        status: "success",
        data: data,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

   
  
