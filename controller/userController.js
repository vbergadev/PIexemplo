const bcrypt = require('bcrypt');

async function saveUser(req, res) {
    // precisa do bodyParser
    const { name, email, age, password } = req.body;
    const saltRounds = 8;
    const hashpassword = await bcrypt.hash(password, saltRounds);
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
}

module.exports = saveUser;
