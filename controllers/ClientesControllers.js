const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Cliente = require ('../models/Cliente')
const Endereco = require ('../models/Endereco');
const { or, where } = require('sequelize');


router.post ('/clientes/salvar', (req,res) => {
  var cpf = req.body.cpf;
  var nome = req.body.nome.toUpperCase();
  var rg = req.body.rg;
  var celular = req.body.celular;
  var telefone = req.body.telefone;
  var email = req.body.email.toUpperCase();
  var origem = req.body.origem.toUpperCase();

  var logadouro = req.body.logadouro.toUpperCase();
  var numero = req.body.numero;
  var complemento = req.body.complemento.toUpperCase();
  var cidade = req.body.cidade.toUpperCase();
  var cep = req.body.cep;

  var empresaId = req.body.empresa

  var msg = ''; // Defina a mensagem desejada
  

  console.log(chalk.red.bold(`RG: ${rg}`))
  console.log(chalk.red.bold(`TELEFONE: ${telefone}`))

  if (rg === '') {
    rg = 'NÃO INFORMADO'
  }
  if (telefone === '') {
    telefone = 'NÃO INFORMADO'
  }
  //Verificando se existe um cpf
  Cliente.findOne({
    where: {
      cpf: cpf
    }
  }).then(cliente => {
    if (cliente) {
      // CPF já cadastrado, exibir mensagem
      msg = 'CPF JÁ ESTA CADASTRADO NO SISTEMA'
      console.log(chalk.red.bold(`CPF ${cpf} já existe.`));
      res.redirect('/admin/cliente/novo' + '?msg=' + msg) ;
    } else {
      
      // CPF não cadastrado, criar um novo cliente
      Cliente.create({
        cpf: cpf,
        nome: nome,
        celular: celular,
        email: email,
        rg: rg,
        telefone: telefone,
        origenId: origem,
        empresaId: empresaId
      }).then((cliente) => {

        Endereco.create({
          logadouro: logadouro,
          numero: numero,
          complemento: complemento,
          cidade: cidade,
          cep: cep,
          clienteId: cliente.id,
          empresaId: empresaId
        })

        msg = 'CLIENTE CADASTRADO COM SUCESSO!!'
        console.log(chalk.green.bold(`Novo cliente cadastrado: CPF ${cpf}`));
        res.redirect ('/admin/cliente/detalhes/' + cliente.id)
        
      }).catch(err => {
        console.log(chalk.red.bold(`Erro ao cadastrar o novo cliente: ${err}`));
        res.send('Erro ao cadastrar o novo cliente.');
      });
    }
  }).catch(err => {
    console.log(chalk.red.bold(`Erro ao verificar o CPF: ${err}`));
    res.send('Erro ao verificar o CPF.');
  });
  
})

router.post ('/clientes/atualizar', (req, res) => {
  var id = req.body.id

  var cpf = req.body.cpf;
  var nome = req.body.nome.toUpperCase();
  var rg = req.body.rg;
  var celular = req.body.celular;
  var telefone = req.body.telefone;
  var email = req.body.email.toUpperCase();
  var origem = req.body.origem.toUpperCase();

  var logadouro = req.body.logadouro.toUpperCase();
  var numero = req.body.numero;
  var complemento = req.body.complemento.toUpperCase();
  var cidade = req.body.cidade.toUpperCase();
  var cep = req.body.cep;



  Cliente.update ({
    cpf: cpf,
    nome: nome,
    rg: rg,
    celular: celular,
    telefone: telefone,
    email: email,
    origenId: origem
  }, {
    where: {
      id: id
    }
  }).then (() => {
    Endereco.update ({
      logadouro: logadouro,
      numero: numero,
      complemento: complemento,
      cidade: cidade,
      cep: cep
    }, { 
      where: {
        clienteId: id
      }
    })
    res.redirect ('/admin/cliente/detalhes/' + id)
  }).catch ((err) => {
    res.send ('err')
  })


})


module.exports = router