const Sequelize = require('sequelize')
const connection = require('../database/database');

const Empresa = connection.define('empresas', {
  descricao : {
    type: Sequelize.STRING,
    allowNull: false
  }, 
});

Empresa.sync ({force: false})
module.exports = Empresa