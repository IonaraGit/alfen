const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Ambiente = require ('../models/Ambiente')

router.post ('/ambiente/salvar', (req,res) => {
  var descricao = req.body.descricao
  var empresaId = req.body.empresa
  var ativo = 1


  if (descricao != undefined) {
    Ambiente.create({
      descricao: descricao.toUpperCase(),
      ativo: ativo,
      empresaId: empresaId
    }).then(() => {
      res.redirect('/acesso/adm/ambientes')
    })
  } else {
    res.send('erro')
  }
})

router.post ('/ambiente/desativar', (req, res) => {
  var id = req.body.id

  Ambiente.update ({
    ativo: false
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/ambientes')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

router.post ('/ambiente/ativar', (req, res) => {
  var id = req.body.id

  Ambiente.update ({
    ativo: true
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/ambientes')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

module.exports = router