const Sequelize = require('sequelize')
const connection = require('../database/database')
const Empresa = require('./Empresa')

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

Empresa.hasMany(Marca) 
Marca.belongsTo(Empresa)

Marca.sync({force: false})

module.exports = Marca