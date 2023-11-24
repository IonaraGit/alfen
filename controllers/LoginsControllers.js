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
  var empresa = req.body.empresa;
  
 
  var msg = 'Verifique os dados e tente novamente';

  Colaborador.findOne({
    where: {
      cpf: cpf
    }
  }).then(colaborador => {
    if (colaborador != undefined) {
      // Agora, encontre a empresa com base na identificação
      Empresa.findOne({
        where: {
          identificacao: empresa
        }
      }).then(empresaEncontrada => {
        if (empresaEncontrada != undefined) {
          // Agora, você tem o colaborador e a empresa
          if (colaborador.primeiro_acesso == 0) {
            sessao = req.session.colaborador = {
              cpf: colaborador.cpf,
              resposta: colaborador.resposta,
              id: colaborador.id,
              empresaId: colaborador.empresaId
            }
          }

          sessao = req.session.colaborador = {
            id: colaborador.id,
            cpf: colaborador.cpf,
            nome: colaborador.nome,
            empresaId: colaborador.empresaId,
            permissoId: colaborador.permissoId // Corrigi um possível erro de digitação
          }
          if ((colaborador.permissoId == 1) && (colaborador.ativo == 0)) {
            res.redirect('/acesso/adm');
          } else if (colaborador.permissoId == 2) {
            res.send('Página a ser definida');
          }
        } else {
          res.send('Empresa não encontrada');
        }
      });
    } else {
      res.send('Colaborador não encontrado');
    }
  });
});



module.exports = router