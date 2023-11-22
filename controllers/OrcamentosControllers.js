const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Orcamento = require ('../models/Orcamento')
const Agenda = require ('../models/Agenda')

router.post('/orcamento/salvar', (req, res) => {
  const inicio = 1;

  console.log('veeeem no id: ', id)
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

  const conta = quantidade.length;
  const para = observacao.length;

  console.log(chalk.red.bold(`tamanho tamanho conta ${conta}`));
  console.log(chalk.red.bold(`tamanho tamanho para ${para}`));

  console.log(chalk.red.bold(`tamanho tamanho OBSERVACAO ${observacao}`));
  const orcamento = [];
  for (let i = 0; i < conta; i++) {
    console.log(chalk.green.bold(`VEZES DO I ${i}`));
    orcamento.push(
      Orcamento.create({
        observacao: observacao[i],
        qtd: quantidade[i],
        valor: valor[i],
        btuId: btus[i],
        marcaId: marca[i],
        modeloId: modelo[i],
        ambienteId: ambiente[i],
        prestacoId: prestacao[i],
        contratado: contratado,
        finalizado: finalizado,
        colaboradoreId: colaboradoreId[i],
        clienteId: clienteId[i],
        empresaId: empresaId[i]
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

module.exports = router