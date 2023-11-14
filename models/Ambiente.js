const Sequelize = require ('sequelize')
const connection = require ('../database/database')

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

Ambiente.sync ({force: false})

module.exports = Ambiente