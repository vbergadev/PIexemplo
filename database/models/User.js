const Sequelize = require("sequelize");
const bcrypt = require('bcrypt');
const connection = require("../database");

const tableName = 'user'
const user = {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

const User = connection.define(tableName, user);

User.sync({force:false}).then(() => {
  console.log(`table ${tableName} created`)
});

module.exports = User;
