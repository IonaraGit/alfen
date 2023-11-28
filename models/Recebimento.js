const Sequelize = require('sequelize')
const connection = require('../database/database');
const Empresa = require ('./Empresa')
const Orcamento = require ('./Orcamento')
const Pagamento = require ('./Pagamento')

const Recebimento = connection.define('recebimentos', {
  valor:{
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

Empresa.hasMany(Recebimento) 
Recebimento.belongsTo(Empresa)

Orcamento.hasMany(Recebimento) 
Recebimento.belongsTo(Orcamento)

Pagamento.hasMany(Recebimento) 
Recebimento.belongsTo(Pagamento)


Recebimento.sync({force: false})

module.exports = Recebimento