const Sequelize = require('sequelize')
const connection = require('../database/database')

const Colaborador = connection.define('colaboradores', {
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cpf: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Colaborador.sync({force: false})

module.exports = Colaborador