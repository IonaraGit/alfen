const Sequelize = require('sequelize')
const connection = require('../database/database')

const Prestacao = connection.define('prestacoes', {
 descricao: {
  type: Sequelize.STRING, 
  allowNull: false
 },  
 ativo: {
  type: Sequelize.BOOLEAN,
  allowNull: false
  }
});

Prestacao.sync ({force: false})

module.exports = Prestacao