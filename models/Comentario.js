const Sequelize = require ('sequelize')
const connection = require ('../database/database')
const Empresa = require('./Empresa');
const Agenda = require('./Agenda');
const Colaborador = require('./Colaborador');

const Comentario = connection.define('comentarios', {
  descricao : {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Empresa.hasMany(Comentario) 
Comentario.belongsTo(Empresa)

Agenda.hasMany(Comentario) 
Comentario.belongsTo(Agenda)

Colaborador.hasMany(Comentario) 
Comentario.belongsTo(Colaborador)


Comentario.sync ({force: false})

module.exports = Comentario