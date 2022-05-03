const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const connection = require("./database/database");

const User = require("./database/models/User");

const saveUser = require('./controller/userController')

const session = require('express-session');

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

// Adicionando express session
app.use(session({resave:true, saveUninitialized: true, secret: 'secret'}))

// ROTAS 
app.get("/",(req, res) => {
    res.render("./main/register.ejs");
});
app.get("/login",(req, res) => {
    res.render("./main/login.ejs");
});
app.get("/profile",validaUsuario, (req, res) => {
    res.render("./main/profile.ejs");
});

app.get("/segura", validaUsuario, (req, res) => {
    res.render("./main/profile.ejs");
});

app.post("/saveuser", saveUser);

app.post("/authuser", login);

// Controller
// async function saveUser (req, res) {
//     // precisa do bodyParser
//     const { name, email, age, password } = req.body;
//     const saltRounds = 8;
//     const hashpassword = await bcrypt.hash(password, saltRounds);
//     User.create({
//         name: name,
//         email: email,
//         age: age,
//         password: hashpassword
//     }).then(() => {
//         console.log("ok")
//     }).catch((error) => {
//         console.log(error)
//     })

//     res.redirect("/login")
// }

async function login(req, res){

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        console.log('Not found!');
    } else {
        const checkPassword = await bcrypt.compare(password, user.password).then((result) => {
            return result
        });
        if(checkPassword && email == user.email) {
            req.session.user = email
            res.redirect("/profile")
        }
    }

}

//Middleware de Rotas

function validaUsuario(req, res, next) {
    const user = req.session.user;
    if(user) {
        next()
    } else {
        res.redirect('/login')
    }
}

app.listen(3000,()=>{console.log("O pai TA on!");});