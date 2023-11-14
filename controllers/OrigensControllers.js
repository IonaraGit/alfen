const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Origem = require ('../models/Origem')

router.post ('/origem/salvar', (req,res) => {
  var descricao = req.body.descricao
  var ativo = 1

  if (descricao != undefined) {
    Origem.create({
      descricao: descricao.toUpperCase(),
      ativo: ativo
    }).then(() => {
      res.redirect('/acesso/adm/origens')
    })
  } else {
    res.send('erro')
  }
})

router.post ('/origem/desativar', (req, res) => {
  var id = req.body.id

  Origem.update ({
    ativo: false
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/origens')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

router.post ('/origem/ativar', (req, res) => {
  var id = req.body.id

  Origem.update ({
    ativo: true
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/origens')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})


module.exports = router