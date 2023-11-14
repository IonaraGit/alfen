const Sequelize = require('sequelize')
const connection = require('../database/database');

const Btu = connection.define('btus', {
  descricao:{
    type: Sequelize.STRING,
    allowNull: false
  },
  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
});
Btu.sync({force: false})

module.exports = Btu