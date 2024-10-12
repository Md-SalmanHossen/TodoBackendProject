const ProfileModel = require("../models/ProfileModel");

exports.CreateProfile = async (req, res) => {
    try {
        let reqBody = req.body;
        const data = await ProfileModel.create(reqBody);
        res.status(200).json({ status: "success", data: data });
    } catch (err) {
        res.status(400).json({ status: "fail", data: err.message });
    }
};

//login user
exports.UserLogin = async (req, res) => {
    try {

        let userName = req.body.userName;
        let password=req.body.password;

        // const data = await ProfileModel.create(reqBody);
        // res.status(200).json({ status: "success", data: userName });

        res.status(200).json({ status: "success",userName:userName, password: password });
    } catch (err) {
        res.status(400).json({ status: "fail", data: err.message });
    }
   
};
