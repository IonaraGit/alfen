const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Prestacao = require ('../models/Prestacao')

router.post ('/prestacao/salvar', (req,res) => {
  var descricao = req.body.descricao
  var ativo = 1
  var empresaId = req.body.empresa

  if (descricao != undefined) {
    Prestacao.create({
      descricao: descricao.toUpperCase(),
      ativo: ativo,
      empresaId: empresaId
    }).then(() => {
      res.redirect('/acesso/adm/prestacoes')
    })
  } else {
    res.send('erro')
  }
})

router.post ('/prestacao/desativar', (req, res) => {
  var id = req.body.id

  Prestacao.update ({
    ativo: false
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/prestacoes')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

router.post ('/prestacao/ativar', (req, res) => {
  var id = req.body.id

  Prestacao.update ({
    ativo: true
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/prestacoes')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})


module.exports = router