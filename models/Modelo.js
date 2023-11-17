const Sequelize = require('sequelize')
const connection = require('../database/database')
const Empresa = require('./Empresa')

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

Empresa.hasMany(Modelo) 
Modelo.belongsTo(Empresa)

Modelo.sync({force: false})

module.exports = Modelo