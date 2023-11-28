const Sequelize = require('sequelize')
const connection = require('../database/database');
const Empresa = require('./Empresa')

const Pagamento = connection.define('pagamentos', {
  descricao:{
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  parcelado: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Empresa.hasMany(Pagamento) 
Pagamento.belongsTo(Empresa)

Pagamento.sync({force: false})

module.exports = Pagamento