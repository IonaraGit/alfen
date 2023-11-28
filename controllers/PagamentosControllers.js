const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Pagamento = require ('../models/Pagamento')

router.post ('/pagamento/salvar', (req,res) => {
  var descricao = req.body.descricao
  var ativo = 1
  var parcelado = req.body.parcelado
  var empresaId = req.body.empresa

  if (descricao != undefined) {
    Pagamento.create({
      descricao: descricao.toUpperCase(),
      ativo: ativo,
      parcelado: parcelado,
      empresaId: empresaId
    }).then(() => {
      res.redirect('/acesso/adm/pagamentos')
    })
  } else {
    res.send('erro')
  }
})

router.post ('/pagamento/desativar', (req, res) => {
  var id = req.body.id

  Pagamento.update ({
    ativo: false
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/pagamentos')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

router.post ('/pagamento/ativar', (req, res) => {
  var id = req.body.id

  Pagamento.update ({
    ativo: true
  }, {
    where: {
      id: id
    }
  }).then (() => {
    res.redirect ('/acesso/adm/pagamentos')
  }).catch (err => {
    console.send ('Erro, entre em contato com o suporte!')
  })
})

module.exports = router