const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Orcamento = require ('../models/Orcamento')
const Pagamento = require ('../models/Pagamento');
const Recebimento = require('../models/Recebimento');
const { or } = require('sequelize');

router.post('/recebimento/salvar', (req, res) => {
  var id = req.body.id;

  var valor = Array.isArray(req.body.valor_recebido) ? req.body.valor_recebido : [req.body.valor_recebido];
  
  var empresaId = Array.isArray(req.body.empresaId) ? req.body.empresaId : [req.body.empresaId];
  var orcamentoId = Array.isArray(req.body.orcamentoId) ? req.body.orcamentoId : [req.body.orcamentoId];
  var pagamentoId = Array.isArray(req.body.pagamento) ? req.body.pagamento : [req.body.pagamento];
  var parcelamento = Array.isArray(req.body.parcelamento) ? req.body.parcelamento : [req.body.parcelamento];
 

  console.log(chalk.red.bold(`VALOR ${valor}`));
  console.log(chalk.red.bold(`EMPRESA ID  ${empresaId}`));
  console.log(chalk.red.bold(`Orçamento ID  ${orcamentoId}`));
  console.log(chalk.red.bold(`Forma de pagamento ${pagamentoId}`));

  console.log(chalk.red.bold(`Parcelado em ${parcelamento} vezes`));
 

 const conta = pagamentoId.length;

 var converte = []
 const recebimento = []

 for (let i = 0; i <  conta; i++) {
  converte = valor[i].replace(/\./g, '').replace (',', '.')
  console.log(chalk.red.bold(`VALOR convertido ${converte}`));
  console.log(chalk.green.bold(`VEZES DO I ${i}`));

    recebimento.push (
      Recebimento.create ({
        valor: converte,
        empresaId: empresaId [i],
        orcamentoId: orcamentoId [i],
        pagamentoId: pagamentoId [i],
        prestacoes: parcelamento [i]
      })
    )
  }

 Promise.all (recebimento)
 .then((rec) => {
  const orcamento = []
  

  for (let i=0; i < rec.length; i++){
    orcamento.push (
      Orcamento.update (
        {contratado: true},
        {valor_recebido: valor_recebido + valor},
        {where: {id: orcamentoId}}
      )
    )
  }
  return Promise.all (orcamento)
})
.then(() => {
  console.log ('ok,feitos')
  res.send ('cadastrado o pagamento')
})
.catch((error) => {
  console.log ('erro', error)
  res.send('erro')
})

 
})






module.exports = router