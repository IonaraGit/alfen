const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Btu = require ('../models/Btu')

router.post ('/btu/salvar', (req,res) => {
  var descricao = req.body.descricao
  var ativo = 1
  var empresaId = req.body.empresa

  if (descricao != undefined) {
    Btu.create({
      descricao: descricao.toUpperCase(),
      ativo: ativo,
      empresaId: empresaId
    }).then(() => {
      res.redirect('/acesso/adm/btus')
    })
  } else {
    res.send('erro')
  }
})

router.post ('/btu/desativar', (req, res) => {
  var id = req.body.id

  Btu.update ({
    ativo: false
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/btus')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

router.post ('/btu/ativar', (req, res) => {
  var id = req.body.id

  Btu.update ({
    ativo: true
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/btus')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

module.exports = router