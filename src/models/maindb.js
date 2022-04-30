const express = require("express");
const validator = require("validator");
const mongo = require("mongoose");


const productlistform = mongo.Schema({
    name: {
        type: String,
        require: true
    },

    price: {
        type: Number,
        require: true
    },

    company: {
        type: String,
        require: true
    },
    size: {
        type: String,
        require: true
    },
    quentity: {
        type: Number,
        require: true
    },
    discription: {
        type: String,
        require: true
    },
    file: {
        type: String,
        require: true
    }
})




const productDB = mongo.model(process.env.DB_ADDPRODUCT_COLLECTION, productlistform)


module.exports = productDB;
