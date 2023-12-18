const Sequelize = require('sequelize')
const connection = require('../database/database')
const Empresa = require('./Empresa')

const Medida = connection.define('medidas', {
  descricao: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Empresa.hasMany(Medida)
Medida.belongsTo(Empresa)

Medida.sync({force: false})

module.exports = Medida