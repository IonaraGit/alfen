const Sequelize = require ('sequelize')

const connection = new Sequelize('alfen', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = connection