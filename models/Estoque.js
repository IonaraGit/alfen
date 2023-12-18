const Sequelize = require('sequelize')
const connection = require('../database/database');
const Empresa = require('./Empresa')
const Medida = require ('./Medida')

const Estoque = connection.define('estoques', {
  descricao:{
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  qtd_minima: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  qtd_atual: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
});


Empresa.hasMany(Estoque) 
Estoque.belongsTo(Empresa)

Medida.hasMany(Estoque) 
Estoque.belongsTo(Medida)

Estoque.sync({force: false})

module.exports = Estoque