const express = require("express");

const mongo = require('mongoose');

mongo.connect(process.env.DBCONNECTIONKEY, {
}).then(() =>{
    console.log('you connected with the server.....');
}).catch((e) => {
    console.log('Data base is not connected');
})