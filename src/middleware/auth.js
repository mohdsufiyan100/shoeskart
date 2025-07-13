
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");

const api_data = require("../models/userregistration");


const auth = async(req , res, next) => {
    try {
        const token = req.cookies.jwt;
        const veryfy = jwt.verify(token, process.env.JWTTOKEN );
        const userdata = await api_data.findOne({_id:veryfy._id});
        req.veryfy = veryfy;
        req.userdata = userdata;

        next();
    } catch (error) {
        res.redirect("/shoeskart/login");
    }
}

module.exports = auth;