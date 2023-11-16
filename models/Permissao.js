const Sequelize = require ('sequelize')
const connection = require ('../database/database');


const Permissao = connection.define('permissoes', {
  descricao : {
    type: Sequelize.STRING,
    allowNull: false
  }
});


Permissao.sync ({force: false})

module.exports = Permissao
