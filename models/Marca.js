const Sequelize = require('sequelize')
const connection = require('../database/database')

const Marca = connection.define('marcas', {
  descricao: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Marca.sync({force: false})

module.exports = Marca