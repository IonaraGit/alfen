const Sequelize = require('sequelize')
const connection = require('../database/database')
const Empresa = require('./Empresa')

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

Empresa.hasMany(Origem) 
Origem.belongsTo(Empresa)

Origem.sync({force: false})

module.exports = Origem