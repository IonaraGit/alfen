const Sequelize = require('sequelize')
const connection = require('../database/database');
const Origem = require('./Origem');

const Cliente = connection.define('clientes', {
  cpf: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rg: {
    type: Sequelize.STRING,
    allowNull: false
  },
  celular: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telefone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cpf: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }  
});

Origem.hasMany(Cliente) // UMA ORIGEM TEM VARIOS CLIENTES
Cliente.belongsTo(Origem) // UM CLIENTE PERTENCE A UMA ORIGEM

Cliente.sync({force: false})

module.exports = Cliente