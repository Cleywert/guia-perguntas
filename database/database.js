const Sequelize = require('sequelize');

const conn = new Sequelize('guiaperguntas','root','123',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = conn;