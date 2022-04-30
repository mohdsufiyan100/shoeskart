let express = require('express');
const path = require("path")
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
// const mongostore = require('connect-mongo')(session);
let app = express();
let port = 8000;

require("../src/db/connections");
const Router = require("../src/routers/router");
const methodOverride = require("method-override");
const { default: mongoose } = require('mongoose');

// require("../src/middleware/passport");

app.use(cookieparser());
app.use(session({
    secret: 'mysupersecret',
    resave: false,
    saveUninitialized: false,
    // store: new mongostore({mongooseConnection: mongoose.connection}),
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