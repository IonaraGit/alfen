const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Estoque = require ('../models/Estoque')

router.post ('/estoque/salvar', (req,res) => {
  var descricao = req.body.descricao
  var ativo = 1
  var empresaId = req.body.empresa
  var medidaId = req.body.medidaId

  if (descricao != undefined) {
    Estoque.create({
      descricao: descricao.toUpperCase(),
      ativo: ativo,
      empresaId: empresaId,
      qtd_minima: 0,
      qtd_atual: 0,
      medidaId: medidaId
    }).then(() => {
      res.redirect('/acesso/adm/estoque')
    })
  } else {
    res.send('erro')
  }
})

router.post ('/estoque/desativar', (req, res) => {
  var id = req.body.id

  Estoque.update ({
    ativo: false
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/estoque')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

router.post ('/estoque/ativar', (req, res) => {
  var id = req.body.id

  Estoque.update ({
    ativo: true
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/estoque')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})





module.exports = router