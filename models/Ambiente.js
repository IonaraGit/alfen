const Sequelize = require ('sequelize')
const connection = require ('../database/database')
const Empresa = require('./Empresa')

const Ambiente = connection.define('ambientes', {
  descricao : {
    type: Sequelize.STRING,
    allowNull: false
  }, 
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});

Empresa.hasMany(Ambiente) 
Ambiente.belongsTo(Empresa)

Ambiente.sync ({force: false})

module.exports = Ambiente