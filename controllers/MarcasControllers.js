const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Marca = require ('../models/Marca')

router.post ('/marca/salvar', (req,res) => {
  var descricao = req.body.descricao
  var ativo = 1
  var empresaId = req.body.empresa

  if (descricao != undefined) {
    Marca.create({
      descricao: descricao.toUpperCase(),
      ativo: ativo,
      empresaId: empresaId
    }).then(() => {
      res.redirect('/acesso/adm/marcas')
    })
  } else {
    res.send('erro')
  }
})

router.post ('/marca/desativar', (req, res) => {
  var id = req.body.id

  Marca.update ({
    ativo: false
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/marcas')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

router.post ('/marca/ativar', (req, res) => {
  var id = req.body.id

  Marca.update ({
    ativo: true
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/marcas')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})


module.exports = router