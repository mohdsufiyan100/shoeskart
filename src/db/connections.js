const express = require("express");

const mongo = require('mongoose');

mongo.connect("mongodb+srv://sufiyan:sufiyan9080@cluster0.zdahw.mongodb.net/shoeskart?retryWrites=true&w=majority", {
}).then(() =>{
    console.log('you connected with the server.....');
}).catch((e) => {
    console.log('Data base is not connected');
})