// const passport = require('passport');
// const localStrategy = require("passport-local").Strategy;
// const user = require("../models/userregistration");


// passport.serializeUser(function(user, done){
//     done(null, user.id)
// });

// passport.deserializeUser(function(id, done){
//     user.findById(id, function(err, user){
//         done(err, user);
//     })
// });
// console.log("running")

// passport.use("local-signup", new localStrategy({
//     usernameField: "email",
//     passwordField: "password",
//     passReqToCallback: true
// }, function(res, email, password, done){
//     user.findOne({"email": email}, function(err, user){
//         if(err){
//            return done(err)
//         }

//         if(user){
//             return done(null, false);
//         }
//         const newUser = new user({
//             Fname: yourfname,
//             Lname: yourlname,
//             email: youremail,
//             phone: yourphone,
//             passowrd: yourpassword,
//         })
//         newUser.save(function(err, result) {
//             if (err) {
//                 return done(err);
//             }
//             return done(null, newUser);
//         });
//     })

// }));