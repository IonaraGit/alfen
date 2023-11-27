const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Orcamento = require ('../models/Orcamento')
const Agenda = require ('../models/Agenda')

router.post('/orcamento/salvar', (req, res) => {



  var id = req.body.id;
  var observacao = Array.isArray(req.body.observacao) ? req.body.observacao : [req.body.observacao];
  var valor = Array.isArray(req.body.valor) ? req.body.valor : [req.body.valor];
  var ambiente = Array.isArray(req.body.ambiente) ? req.body.ambiente : [req.body.ambiente];
  var marca = Array.isArray(req.body.marca) ? req.body.marca : [req.body.marca];
  var modelo = Array.isArray(req.body.modelo) ? req.body.modelo : [req.body.modelo];
  var btus = Array.isArray(req.body.btus) ? req.body.btus : [req.body.btus];
  var prestacao = Array.isArray(req.body.prestacao) ? req.body.prestacao : [req.body.prestacao];
  var quantidade = Array.isArray(req.body.quantidade) ? req.body.quantidade : [req.body.quantidade];
  var colaboradoreId = Array.isArray(req.body.colaboradoreId) ? req.body.colaboradoreId : [req.body.colaboradoreId];
  var clienteId = Array.isArray(req.body.clienteId) ? req.body.clienteId : [req.body.clienteId];
  var empresaId = Array.isArray(req.body.empresaId) ? req.body.empresaId : [req.body.empresaId];
  var contratado = false;
  var finalizado = false;
  var valor_recebido = 0;

  const conta = quantidade.length;
  const para = observacao.length;
 


  console.log(chalk.red.bold(`VALOR ${valor}`));
  
 var converte = []
  const orcamento = [];
  for (let i = 0; i < conta; i++) {
    converte = valor[i].replace(/\./g, '').replace (',', '.')
    console.log(chalk.red.bold(`VALOR convertido ${converte}`));
    console.log(chalk.green.bold(`VEZES DO I ${i}`));
    orcamento.push(
      Orcamento.create({
        observacao: observacao[i],
        qtd: quantidade[i],
        valor: converte,
        btuId: btus[i],
        marcaId: marca[i],
        modeloId: modelo[i],
        ambienteId: ambiente[i],
        prestacoId: prestacao[i],
        contratado: contratado,
        finalizado: finalizado,
        colaboradoreId: colaboradoreId[i],
        clienteId: clienteId[i],
        empresaId: empresaId[i],
        valor_recebido: valor_recebido
      })
    );
  }

  Promise.all(orcamento)
    .then(() => {
      console.log('Orçamentos criados com sucesso.');
      res.redirect ('/admin/orcamentos/decisao/' + id)
    })
    .catch((error) => {
      console.error('Erro ao criar os orçamentos:', error);
      res.status(500).send('erro');
    });
});


router.post ('/orcamento/agendamento/salvar', (req, res) => {
  var data1 = Array.isArray(req.body.data1) ? req.body.data1 : [req.body.data1];
  var data2 = Array.isArray(req.body.data2) ? req.body.data2 : [req.body.data2];
  var horario = Array.isArray(req.body.horario) ? req.body.horario : [req.body.horario];
  var colaboradorId = Array.isArray(req.body.colaborador) ? req.body.colaborador : [req.body.colaborador];
  var empresaId = req.body.empresa
  var clienteId =  req.body.id
  var orcamentoId =  req.body.orcamento

  console.log(chalk.blue.bold('data 1 ' + data1));
  console.log(chalk.blue.bold('data 2 ' + data2))
  console.log(chalk.blue.bold('Horario ' + horario))
  console.log(chalk.blue.bold('Colaborador ' + colaboradorId))
  console.log(chalk.blue.bold('Empresa ' + empresaId))
  console.log(chalk.blue.bold('Orcamento ' + orcamentoId))

  const conta = horario.length

  const agenda = []
  for (let i = 0; i < conta; i++) {
    agenda.push (
      Agenda.create ({
        previsao_inicio: data1 [i],
        previsao_fim: data2 [i],
        horario: horario [i],
        colaboradoreId: colaboradorId [i],
        empresaId: empresaId,
        clienteId: clienteId, 
        orcamentoId: orcamentoId

      })
    )
  }

  Promise.all (agenda)
    .then((ag) => {
      const orcamento = []

      for (let i = 0; i < ag.length; i++) {
        orcamento.push (
          Orcamento.update (
            {contratado: true},
            {where: { id: orcamentoId}}
          )
        )
      }
      return Promise.all (orcamento)
      
    })
    .then(() => {
      console.log ('ok, feitos')
      res.redirect ('/admin/orcamentos/prosseguir/' + clienteId)
    })
    .catch((error) => {
      console.log ('erro', error)
      res.send('erro')
    })

})

router.post ('/orcamento/agendamento/editar/salvar', (req, res) => {
  var data1Edicao = req.body.data1Edicao;
  var data2Edicao = req.body.data2Edicao;
  var colaboradorEdicao = req.body.colaboradorEdicao
  var horarioEdicao = req.body.horarioEdicao
  var orcamentoId = req.body.orcamentoId
  var id = req.body.id

  console.log(chalk.red.bold(`horario ${horarioEdicao}`));
  
  Agenda.update ({
    
    previsao_inicio: new Date(data1Edicao + 'T00:00:00Z'),
    previsao_fim: new Date(data2Edicao + 'T00:00:00Z'),
    horario: horarioEdicao,
    colaboradoreId: colaboradorEdicao
  }, {
    where: {
      orcamentoId: orcamentoId
    }
  }).then(() => {
    res.redirect ('/admin/orcamentos/prosseguir/' + id)
  }).catch ((error) => {
    res.send ('erro')
  })

})


module.exports = router