const Sequelize = require('sequelize')
const connection = require('../database/database')

const Origem = connection.define('origens', {
  descricao: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Origem.sync({force: false})

module.exports = Origem