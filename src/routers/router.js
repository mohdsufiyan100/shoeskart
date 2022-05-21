const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const forproductlist = require("../models/maindb")
const auth = require("../middleware/auth");
const foruserreg = require("../models/userregistration")
const upload = require("../middleware/forimages");
const Router = new express.Router();
const session = require('express-session');



Router.get('/shoeskart',auth, async(req, res) => {
    try {
       
        await forproductlist.find().then((data) => {
            res.status(200).render('pages/home.ejs', {productdata: data});
        }).catch((err) => {
            res.status(401).send(`ths is ${err}`);

        })
        
    } catch (error) {
        res.status(500).send(error)
    }
})

Router.get('/shoeskart/profile',auth, async(req, res) => {
    let user = req.userdata
    res.status(200).render('pages/user_profile.ejs', {profile: user});
})

Router.get('/shoeskart/productlist',auth, async(req, res) => {
    res.status(200).render('pages/productlist.ejs', {success: ""});
})
Router.post('/shoeskart/productlist',auth,upload.single("productimage"), async(req, res) => {
    try {
        const Product = new forproductlist({
            name: req.body.productname,
            price: req.body.productprice,
            company: req.body.productcompany,
            size: req.body.productsize,
            quentity: req.body.productquentity,
            discription: req.body.productdiscription,
            file: req.file.filename
        })
        await Product.save().then(() => {
            res.status(200).render('pages/productlist.ejs', {success: "Product inserted successfully"});
            res.redirect("/shoeskart/productlist")
        }).catch((err) => {
            console.log(`your error is: ${err}`)
        })
    } catch (error) {
        res.status(404).send(error);
        
    }
})

Router.get('/shoeskart/login', (req, res) => {
    res.status(200).render('pages/login.ejs', {loginalert: ""});
})  
Router.post('/shoeskart/login', async (req, res) => {
    try {
        let inputemail = req.body.inputemail;
        let inputpassword = req.body.inputpassword;

        let userauthentication = await foruserreg.findOne({email:inputemail})
        let ismatch = await bcrypt.compare(inputpassword, userauthentication.password)
        let gentoken = await userauthentication.createtoken();
        res.cookie("jwt", gentoken , {
            // expires: new Date(Date.now() + 70000),
            httpOnly: true   // using httpOnly attribute user could not remove cookies
        });
        if(ismatch){
            console.log(`your password is matched.....`)
            res.redirect("/shoeskart");
        }
        else{
            res.redirect("/shoeskart/login");

        }
    } catch (error) {
        res.status(401).send(error)
    }
})
Router.get('/shoeskart/register', (req, res) => {
    res.status(200).render('pages/register.ejs');
})

Router.post('/shoeskart/register', async(req, res) => {
    try {
        const user = new foruserreg({
            Fname: req.body.yourfname,
            Lname: req.body.yourlname,
            email: req.body.youremail,
            phone: req.body.yourphone,
            password: req.body.yourpassword,
            address: {

                nameaddress: req.body.addressname,
                phoneaddress: req.body.addressphone,
                emailaddress: req.body.addressemail,
                areaaddress: req.body.addressarea,
                pincodeaddress: req.body.addresspincode,
                cityaddress: req.body.addresscity,
                stateaddress: req.body.addressstate
            }
        })
        let webtoken = await user.createtoken();
        res.cookie("jwt", webtoken , {
            // expires: new Date(Date.now() + 30000),
            httpOnly: true   // using httpOnly attribute user could not remove cookies
        });
        await user.save().then(() => {
            console.log("Data saved....")
            res.redirect("/shoeskart")
        }).catch((err) => {
            console.log(`your error is: ${err}`)
        })
    } catch (error) {
        res.send(401).send(error)
    }
})
// Router.get('/shoeskart/editdata/:id', (req, res) => {
//     res.status(200).render('pages/user_profile.ejs' , {success: ""});
// })

Router.put('/shoeskart/editdata/:id',auth, async(req, res) => {
    
    try {
        req.updatedata = await foruserreg.findById(req.params.id)
        let data = req.updatedata
        data.address[0].nameaddress = req.body.addressname;
        data.address[0].phoneaddress = req.body.addressphone;
        data.address[0].emailaddress = req.body.addressemail;
        data.address[0].areaaddress = req.body.addressarea;
        data.address[0].pincodeaddress = req.body.addresspincode;
        data.address[0].cityaddress = req.body.addresscity;
        data.address[0].stateaddress = req.body.addressstate;
        await data.save().then(() => {
            res.redirect("/shoeskart/profile") 
            res.status(200).render('pages/user_profile.ejs');
        }).catch(() => {
            res.redirect("/shoeskart")
        })

    } catch (error) {
        res.status(400).send(error);
    }
})
Router.put('/shoeskart/edituserinfo/:id',auth, async(req, res) => {
    
    try {
        req.updatedata = await foruserreg.findById(req.params.id)
        let data = req.updatedata
        data.Fname = req.body.yourfname;
        data.Lname = req.body.yourlname;
        data.email = req.body.youremail;
        data.phone = req.body.yourphone;
        await data.save().then(() => {
            
            res.redirect("/shoeskart/profile")     
        }).catch(() => {
            res.redirect("/shoeskart")
        })

    } catch (error) {
        res.status(400).send(error);
    }
})


Router.get('/shoeskart/passwordchange/:id',auth, async(req, res) => {
    try {
        const forupdate = req.params.id
        let current = req.body.currentpassword;
        req.updatedata = await foruserreg.findById(forupdate)
        let data = req.updatedata
        let ismatch = await bcrypt.compare(current, data.password)
        if (ismatch) {
            data.password = req.body.yourpassword;
            res.redirect("/shoeskart/profile")
        } else {
            res.redirect("/shoeskart")
        }
    } catch (error) {
        res.status(500).send(error);
    }
})
Router.get('/shoeskart/aboutus',auth, async(req, res) => {
    try {
        res.status(200).render('pages/aboutus.ejs');
    } catch (error) {
        res.status(500).send(error);
    }
})
Router.get('/shoeskart/addtocart/:id',auth, async(req, res) => {
    try {

        const productid = req.params.id
        await forproductlist.findOne({_id: productid}).then((data) => {
            if (req.session.dataproduct == undefined) {
                req.session.dataproduct = [];
                req.session.dataproduct.push({
                    productimage: data.file,
                    productname: data.name,
                    productprice: data.price,
                    productsize: data.size,
                    qnt: 1,
                    productidentity: data._id
                });
            } else{
                var cart = req.session.dataproduct;
                var newproduct = true;

                for (var i = 0; i < cart.length; i++) {
                    if (cart[i].productname == data.name) {
                        cart[i].qnt++;
                        newproduct = false;
                        break;
                    }
                }

                if (newproduct) {
                    cart.push({
                        productimage: data.file,
                        productname: data.name,
                        productprice: data.price,
                        productsize: data.size,
                        qnt: 1,
                        productidentity: data._id

                    })
                }
            }
            res.redirect("back")
        }).catch((err) => {
            res.send(`error found ${err}`)

        })
       
    } catch (error) {
        res.status(500).send(error);
    }
})

Router.get('/shoeskart/addtocart',auth, async(req, res) => {
    try {
        res.status(200).render('pages/addtocart.ejs', {cartdata: req.session.dataproduct});
    } catch (error) {
        res.status(500).send(error);
    }
})
Router.get('/shoeskart/addtocart/update/:productname',auth, async(req, res) => {
    try {
        const product = req.params.productname;
        const cart = req.session.dataproduct;
        const action = req.query.action;
        
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].productname == product) {
                switch (action) {
                    case "add":
                        cart[i].qnt++;
                        break;
                    case "clear":
                        cart.splice(i, 1);
                        break;
                    case "remove":
                        cart[i].qnt--;
                        if (cart[i].qnt < 1) {
                            cart.splice(i, 1)
                        }
                        break;
                
                    default:
                        console.log("update.....");
                        break;
                }
                break;
            }
            
        }
        res.redirect("back")
        

    } catch (error) {
        res.status(500).send(error);
    }
})

Router.get('/shoeskart/addtocart/deleteall',auth, async(req, res) => {
    try {
        const cart = req.session.dataproduct;
        cart.destroy(() => {
            res.redirect("/shoeskart/profile")
        })

    } catch (error) {
        res.status(500).send(error);
    }
})


Router.get('/shoeskart/logout',auth, async(req, res) => {
    try {
        req.userdata.tokens = req.userdata.tokens.filter((currentElement) => {
            return currentElement.token != req.token
        })
        res.clearCookie("jwt")
        await req.foruserreg.save()
    } catch{
        res.redirect("/shoeskart/login")
    }
})
Router.get('*', (req, res) => {
    res.render('pages/404.ejs', {
        errorpage: "Sorry page not found"
    });
})

module.exports = Router;
