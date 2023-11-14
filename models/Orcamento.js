const Sequelize = require('sequelize')
const connection = require('../database/database');
const Colaborador = require('./Colaborador');
const Cliente = require('./Cliente')
const Marca = require('./Marca')
const Modelo = require('./Modelo')
const Prestacao = require('./Prestacao');
const Ambiente = require('./Ambiente');
const Btu = require ('./Btu')

const Orcamento = connection.define('orcamentos', {
  qtd: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  valor: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  observacao: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contratado: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  finalizado: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

Cliente.hasMany(Orcamento) // UM CLIENTE TEM VARIOS ORCAMENTOS
Orcamento.belongsTo(Cliente) // UM ORCAMENTO PERTENCE A UM CLIENTE

Colaborador.hasMany(Orcamento) // UM COLABORADOR TEM VARIOS ORCAMENTOS
Orcamento.belongsTo(Colaborador) // UM ORCAMENTO PERTENCE A UM CLIENTE

Marca.hasMany(Orcamento)
Orcamento.belongsTo(Marca)

Modelo.hasMany(Orcamento)
Orcamento.belongsTo(Modelo)

Prestacao.hasMany(Orcamento)
Orcamento.belongsTo(Prestacao)

Ambiente.hasMany(Orcamento)
Orcamento.belongsTo(Ambiente)

Btu.hasMany(Orcamento)
Orcamento.belongsTo(Btu)


Orcamento.sync({force: false})

module.exports = Orcamento
