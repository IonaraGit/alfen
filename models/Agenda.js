const Sequelize = require('sequelize')
const connection = require('../database/database');
const Empresa = require('./Empresa')
const Colaborador = require ('./Colaborador')

const Agenda = connection.define('agendas', {
  previsao_inicio:{
    type: Sequelize.DATE,
    allowNull: false
  },
  previsao_fim:{
    type: Sequelize.DATE,
    allowNull: false
  },
  horario: {
    type: Sequelize.TIME,
    allowNull: false
  }
});

Empresa.hasMany(Agenda) 
Agenda.belongsTo(Empresa)

Colaborador.hasMany(Agenda) 
Agenda.belongsTo(Colaborador)

Agenda.sync ({force: false})

module.exports = Agenda