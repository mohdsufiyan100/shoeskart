
const res = require("express/lib/response");
// const { verify } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const api_data = require("../models/userregistration");


const auth = async(req , res, next) => {
    try {
        const token = req.cookies.jwt;
        const veryfy = jwt.verify(token, "mynameismohdsufiyaniamadeveloper" );
        // console.log(veryfy);
        const userdata = await api_data.findOne({_id:veryfy._id});
        req.veryfy = veryfy;
        req.userdata = userdata;

        next();
    } catch (error) {
        res.redirect("/shoeskart/login");
        // res.status(400).send(error);
    }
}

module.exports = auth;