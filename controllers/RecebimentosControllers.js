const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Orcamento = require ('../models/Orcamento')
const Pagamento = require ('../models/Pagamento');
const Recebimento = require('../models/Recebimento');
const Sequelize = require('sequelize');

router.post('/recebimento/salvar', (req, res) => {
  var id = req.body.id;

  const idCliente = req.body.id_cliente;

  var valor = Array.isArray(req.body.valor_recebido) ? req.body.valor_recebido : [req.body.valor_recebido];
  
  var empresaId = Array.isArray(req.body.empresaId) ? req.body.empresaId : [req.body.empresaId];
  var orcamentoId = Array.isArray(req.body.orcamentoId) ? req.body.orcamentoId : [req.body.orcamentoId];
  var pagamentoId = Array.isArray(req.body.pagamento) ? req.body.pagamento : [req.body.pagamento];
  var parcelamento = Array.isArray(req.body.parcelamento) ? req.body.parcelamento : [req.body.parcelamento];
  var em_aberto = Array.isArray(req.body.em_aberto) ? req.body.em_aberto : [req.body.em_aberto]; 

  
  console.log(chalk.red.bold(`VALOR ${valor}`));
  console.log(chalk.red.bold(`EMPRESA ID  ${empresaId}`));
  console.log(chalk.red.bold(`Orçamento ID  ${orcamentoId}`));
  console.log(chalk.red.bold(`Forma de pagamento ${pagamentoId}`));
  console.log(chalk.red.bold(`EM ABERTO VINDO DO FRONT ${ em_aberto}`));
  

  console.log(chalk.red.bold(`Parcelado em ${parcelamento} vezes`));
 
 

 const conta = pagamentoId.length;
 const conta2 = em_aberto.length

 var resultadoC = []
 
 const recebimento = []


 var resultadoC = 0

 for (let i = 0; i < conta2; i ++) {
  resultadoC += parseFloat(em_aberto[i].replace(/\./g, '').replace(',', '.'));

  var converteEmAberto =  parseFloat(em_aberto[i].replace(/\./g, '').replace(',', '.'))

  console.log(chalk.red.bold(`VALOR convertido EM ABERTO ${converteEmAberto}`));
 }

 let recebea = 0;

 let somaRecebimentos = 0
 for (let i = 0; i <  conta; i++) {
  let converte = parseFloat(valor[i].replace(/\./g, '').replace(',', '.'));

  somaRecebimentos += converte

 
 
  console.log(chalk.red.bold(`VALOR convertido ${converte}`));
  console.log(chalk.green.bold(`VEZES DO I ${i}`));

  recebea += converte;

 console.log(chalk.green.bold(`testando rs ${recebea}`))

 
  }
  let resultadoFinal = resultadoC - recebea;

  console.log(chalk.green.bold(`SOMA RECEBIDOS final: ${somaRecebimentos}`));
  console.log(chalk.green.bold(`Resultado final: ${resultadoFinal}`));

  let msg = 'O valor recebido não pode ser maior que o saldo devedor';

  if (somaRecebimentos > converteEmAberto) {
    // Codificar a mensagem na URL
    const encodedMsg = encodeURIComponent(msg);
    // Redirecionar para a página de pagamento com a mensagem de erro
    return res.redirect(`/admin/orcamentos/pagamento/${idCliente}/${orcamentoId}?error=${encodedMsg}`);
  }else {
    for (let i = 0; i <  conta; i++) {
      let converte = parseFloat(valor[i].replace(/\./g, '').replace(',', '.'));
     
      console.log(chalk.red.bold(`VALOR convertido ${converte}`));
      console.log(chalk.green.bold(`VEZES DO I ${i}`));
    
      recebea += converte;
    
     console.log(chalk.green.bold(`testando rs ${recebea}`))
    
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

    
  }

 Promise.all (recebimento)
 .then((rec) => {
  const orcamento = []
  var converte2 = []
  for (let i=0; i < rec.length; i++){
    converte2 = valor[i].replace(/\./g, '').replace (',', '.')
    orcamento.push (
      Orcamento.update (
        {
          valor_recebido: Sequelize.literal(`valor_recebido + ${converte2}`),
          valor_aberto: resultadoFinal
        },
        {where: {id: orcamentoId}}
      )
    )
  }

  return Promise.all (orcamento)
})
.then(() => {
  console.log ('ok,feitos')
  res.redirect(`/admin/orcamentos/pagamento/${idCliente}/${orcamentoId}`);
})
.catch((error) => {
  console.log ('erro', error)
  res.send('erro no salvar')
})

 
})

router.post('/recebimento/excluir/:id_recebimento', (req, res) => {
  const idRecebimento = req.params.id_recebimento;
  const idCliente = req.body.id_cliente;
  const idOrcamento = req.body.id_orcamento;
  
  
  const valorExcluido = req.body.valor_recebido;
console.log(chalk.red.bold(`VALOR EXCLUÍDO que vem do body ${valorExcluido}`));

// Remover caracteres não numéricos, pontos e substituir vírgulas por ponto
const valorNumerico = parseFloat(valorExcluido.replace(/[^\d,]/g, '').replace(',', '.'));

console.log(chalk.red.bold(`VALOR EXCLUÍDO convertido ${valorNumerico}`));

  
  
 

  if (idRecebimento !== undefined && !isNaN(idRecebimento)) {
    // Buscar o valor e o ID do orçamento associado ao recebimento
    Recebimento.findByPk(idRecebimento)
      .then((recebimento) => {
        if (!recebimento) {
          return res.send('Recebimento não encontrado');
        }

        const valorRecebido = recebimento.valor;
        const orcamentoId = recebimento.orcamentoId;

        // Excluir o recebimento
        return Recebimento.destroy({
          where: {
            id: idRecebimento
          }
        })
          .then(() => {
            // Atualizar o valor recebido no orçamento
            return Orcamento.findByPk(orcamentoId);
          })
          .then((orcamento) => {
            if (orcamento) {
              const novoValorRecebido = orcamento.valor_recebido - valorRecebido;
              const novoValorEmAberto = orcamento.valor_aberto + valorNumerico
          
              return Orcamento.update(
                {
                  valor_recebido: novoValorRecebido,
                  valor_aberto: novoValorEmAberto
                },
                {
                  where: {
                    id: orcamentoId
                  }
                }
              );
            } else {
              return Promise.resolve(); // Orçamento não encontrado, retornar uma promessa resolvida
            }
          });
      })
      .then(() => {
       res.redirect('/admin/orcamentos/pagamento/' + idCliente + '/' + idOrcamento)
      })
      .catch((err) => {
        res.send('Erro >>' + err);
      });
  } else {
    res.send('ID de recebimento inválido');
  }
});















module.exports = router