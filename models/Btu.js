const Sequelize = require('sequelize')
const connection = require('../database/database');
const Empresa = require('./Empresa')

const Btu = connection.define('btus', {
  descricao:{
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Empresa.hasMany(Btu) 
Btu.belongsTo(Empresa)

Btu.sync({force: false})

module.exports = Btu