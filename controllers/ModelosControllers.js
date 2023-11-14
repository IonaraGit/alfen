const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Modelo = require ('../models/Modelo')

router.post ('/modelo/salvar', (req,res) => {
  var descricao = req.body.descricao
  var ativo = 1

  if (descricao != undefined) {
    Modelo.create({
      descricao: descricao.toUpperCase(),
      ativo: ativo
    }).then(() => {
      res.redirect('/acesso/adm/modelos')
    })
  } else {
    res.send('erro')
  }
})

router.post ('/modelo/desativar', (req, res) => {
  var id = req.body.id

  Modelo.update ({
    ativo: false
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/modelos')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

router.post ('/modelo/ativar', (req, res) => {
  var id = req.body.id

  Modelo.update ({
    ativo: true
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/modelos')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})


module.exports = router