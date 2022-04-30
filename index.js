const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const bcrypt = require('bcrypt');

const connection = require("./database/database");

const userModel = require("./database/models/User");

const User = require("./database/models/User");

connection
    .authenticate()
    .then(() => {
        console.log("conectado ao banco")
    })
    .catch((error) => {
        console.log(error)
    })
// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine','ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json()); // para APIs

app.get("/",(req, res) => {
    res.render("./main/register.ejs");
});
app.get("/login",(req, res) => {
    res.render("./main/login.ejs");
});
app.get("/profile",(req, res) => {
    res.render("./main/profile.ejs");
});

app.post("/saveuser", async (req, res) => {
    // precisa do bodyParser
    const { name, email, age, password } = req.body;
    const saltRounds = 8;
    const hashpassword = await bcrypt.hash(password, saltRounds)
    User.create({
        name: name,
        email: email,
        age: age,
        password: hashpassword
    }).then(() => {
        console.log("ok")
    }).catch((error) => {
        console.log(error)
    })

    res.redirect("/login")
});
app.post("/authuser", async (req, res) => {
    // precisa do bodyParser
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        console.log('Not found!');
    } else {
        const checkPassword = bcrypt.compare(password, user.password).then((result) => {
            return result
        })
        if(checkPassword && email == user.email) {         
            res.redirect("/profile")
        }
    }

});

app.listen(3000,()=>{console.log("O pai TA on!");});