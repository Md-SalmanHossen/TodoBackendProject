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
