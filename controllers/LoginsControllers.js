const express = require ('express')
const router = express.Router();

const bcrypt = require ('bcryptjs')

const chalk = require('chalk')

const Colaborador = require ('../models/Colaborador')
const Cliente = require ('../models/Cliente')
const Empresa = require ('../models/Empresa')

router.post('/autenticacao', (req, res) => {
  var cpf = req.body.cpf;
  var senha = req.body.senha;
  var msg = 'Verifique os dados e tente novamente';

  Colaborador.findOne ({
    where: {
      cpf: cpf
    }
  }).then (colaborador => {
    //se existe
    if (colaborador != undefined) {
      //validar a senha
      if (colaborador.primeiro_acesso == 0) {
        sessao = req.session.colaborador = {
          cpf: colaborador.cpf,
          resposta: colaborador.resposta
        }
      }
      
      sessao = req.session.colaborador = {
        id: colaborador.id,
        cpf: colaborador.cpf,
        nome: colaborador.nome,
        empresaId: colaborador.empresaId,
        permissoId: colaborador.permmissoId
      }

      if (colaborador.permissoId == 1) {
        res.send ('permissao = 1' + sessao)
      }
      if (colaborador.permissoId == 2 ) {
        res.send ('permissao =2' + sessao)
      } 

    }
  })

})



module.exports = router