const Sequelize = require('sequelize')
const connection = require('../database/database')
const Cliente = require('./Cliente')
const Empresa = require ('./Empresa')

const Endereco = connection.define('enderecos', {
  logadouro: {
    type: Sequelize.STRING,
    allowNull: false
  },
  numero: {
    type: Sequelize.STRING,
    allowNull: false
  },
  complemento: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cidade: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cep: {
    type: Sequelize.STRING,
    allowNull: false
  } 
});

Cliente.hasMany(Endereco) // UM CLIENTE TEM VARIOS ENDEREÇOS
Endereco.belongsTo(Cliente) // UM ENDEREÇO PERTENCE A UM CLIENTE

Empresa.hasMany(Endereco) 
Endereco.belongsTo(Empresa)

Endereco.sync({ force: false })

module.exports =  Endereco