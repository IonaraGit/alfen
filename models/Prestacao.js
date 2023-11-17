const Sequelize = require('sequelize')
const connection = require('../database/database')
const Empresa = require ('./Empresa')

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


Empresa.hasMany(Prestacao) 
Prestacao.belongsTo(Empresa)

Prestacao.sync ({force: false})

module.exports = Prestacao