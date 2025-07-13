
const express = require("express");
const validator = require("validator");
const mongo = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const userregistration = mongo.Schema({
    Fname: {
        type: String,
        require: true
    },

    Lname: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    address: [
        {
            nameaddress: {
                type: String,
                require: true
            },
            phoneaddress: {
                type: String,
                require: true
            },
            emailaddress: {
                type: String,
                require: true
            },
            areaaddress: {
                type: String,
                require: true
            },
            pincodeaddress: {
                type: String,
                require: true
            },
            cityaddress: {
                type: String,
                require: true
            },
            stateaddress: {
                type: String,
                require: true
            }
        }
    ]
    
})

userregistration.methods.createtoken = async function(){
    try {
        const jwttoken = jwt.sign({_id:this._id}, process.env.JWTTOKEN);
        this.tokens = this.tokens.concat({token:jwttoken});
        await this.save();  
        return jwttoken
    } catch (error) {
        console.log(error);
    }
}


userregistration.pre("save", async function(next){
    if(this.isModified("password")){
        console.log(`current password ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`current hashed password ${this.password}`);
    }
    next();
})


const registerDB = mongo.model(process.env.DB_REGISTERED_COLLECTION, userregistration)

module.exports = registerDB;
