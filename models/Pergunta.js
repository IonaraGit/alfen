const Sequelize = require('sequelize')
const connection = require('../database/database');
const Empresa = require('./Empresa')
const Colaborador =  require ('./Colaborador')

const Pergunta = connection.define('perguntas', {
  descricao:{
    type: Sequelize.STRING,
    allowNull: false
  }
});


Pergunta.sync({force: false})

module.exports = Pergunta