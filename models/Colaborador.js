const Sequelize = require('sequelize')
const connection = require('../database/database');
const Permissao = require('./Permissao');
const Empresa = require('./Empresa');

const Colaborador = connection.define('colaboradores', {
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cpf: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  primeiro_acesso: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  pergunta: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  resposta: {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contato: {
    type: Sequelize.STRING,
    allowNull: false
  }
});


Permissao.hasMany(Colaborador) 
Colaborador.belongsTo(Permissao) 

Empresa.hasMany(Colaborador) 
Colaborador.belongsTo(Empresa)

Colaborador.sync({force: false})

module.exports = Colaborador