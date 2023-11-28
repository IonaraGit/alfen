const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Orcamento = require ('../models/Orcamento')
const Pagamento = require ('../models/Pagamento');
const Recebimento = require('../models/Recebimento');

router.post('/recebimento/salvar', (req, res) => {
  var id = req.body.id;

  var valor = Array.isArray(req.body.valor_recebido) ? req.body.valor_recebido : [req.body.valor_recebido];
  
  var empresaId = Array.isArray(req.body.empresaId) ? req.body.empresaId : [req.body.empresaId];
  var orcamentoId = Array.isArray(req.body.orcamentoId) ? req.body.orcamentoId : [req.body.orcamentoId];
  var pagamentoId = Array.isArray(req.body.pagamento) ? req.body.pagamento : [req.body.pagamento];
  var parcelamento = req.body.parcelamento
 
  
  
 

  console.log(chalk.red.bold(`VALOR ${valor}`));
  console.log(chalk.red.bold(`EMPRESA ID  ${empresaId}`));
  console.log(chalk.red.bold(`Orçamento ID  ${orcamentoId}`));
  console.log(chalk.red.bold(`Forma de pagamento  ${pagamentoId}`));

  console.log(chalk.red.bold(`Parcelado em ${parcelamento} vezes`));
 


  res.send ('verificando')
})

module.exports = router