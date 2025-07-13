require("dotenv").config();
let express = require('express');
const path = require("path")
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
let app = express();
let port = process.env.PORT || 8000;

require("./db/connections");
const Router = require("./routers/router");
const methodOverride = require("method-override");
const { default: mongoose } = require('mongoose');

app.use(cookieparser());
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../static")))

const viewsfolder = path.join(__dirname, "../views");

app.set("views engine", "ejs");
app.set("views", viewsfolder);
app.use("/assets", express.static('assets'))

app.use(Router);


app.listen(port, () => {
    console.log(`Server listen in port ${port}`);
})