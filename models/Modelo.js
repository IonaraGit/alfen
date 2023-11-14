const Sequelize = require('sequelize')
const connection = require('../database/database')

const Modelo = connection.define('modelos', {
  descricao: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Modelo.sync({force: false})

module.exports = Modelo