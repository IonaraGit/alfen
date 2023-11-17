const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Colaborador = require ('../models/Colaborador');


router.post ('/colaborador/salvar', (req,res) => {
  var nome = req.body.nome
  var cpf = req.body.cpf
  var ativo = 1
  var senha = 'SEM ACESSO'
  var primeiro_acesso = 0
  var pergunta = 'SEM ACESSO'
  var resposta = 'SEM ACESSO'
  var email = req.body.email
  var contato = req.body.contato
  var permissoId = req.body.permissao
  var empresaId = req.body.empresa
  if (nome != undefined) {
    Colaborador.create({
      nome: nome.toUpperCase(),
      cpf: cpf,
      ativo: ativo,
      senha: senha,
      primeiro_acesso: primeiro_acesso,
      pergunta: pergunta,
      resposta: resposta,
      email: email,
      contato: contato,
      permissoId: permissoId,
      empresaId: empresaId
    }).then(() => {
      res.redirect('/acesso/adm/colaboradores')
    })
  } else {
    res.send('erro')
  }
})


router.post ('/colaborador/desativar', (req, res) => {
  var id = req.body.id

  Colaborador.update ({
    ativo: false
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/colaboradores')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

router.post ('/colaborador/ativar', (req, res) => {
  var id = req.body.id

  Colaborador.update ({
    ativo: true
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/colaboradores')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})


module.exports = router