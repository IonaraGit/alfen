const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Colaborador = require ('../models/Colaborador');


router.post ('/colaborador/salvar', (req,res) => {
  var nome = req.body.nome
  var cpf = req.body.cpf
  var ativo = 1

  if (nome != undefined) {
    Colaborador.create({
      nome: nome.toUpperCase(),
      cpf: cpf,
      ativo: ativo
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