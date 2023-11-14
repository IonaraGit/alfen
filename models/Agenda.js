const Sequelize = require('sequelize')
const connection = require('../database/database');

const Agenda = connection.define('agendas', {
  previsao_inicio:{
    type: Sequelize.DATE
  }
});

module.exports = Agenda