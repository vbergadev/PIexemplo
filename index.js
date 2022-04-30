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

app.get("/ask", (req,res) => {
    res.render("ask")
})

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
        res.redirect("/login")
    }).catch((error) => {
        console.log(error)
    })

    res.send(`${name} ${email} ${age} ${password}`)
});

app.listen(3000,()=>{console.log("O pai TA on!");});