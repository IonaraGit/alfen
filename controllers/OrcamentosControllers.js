const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Orcamento = require ('../models/Orcamento')

router.post('/orcamento/salvar', (req, res) => {
  const inicio = 1;

  var id = req.body.id;
  var observacao = Array.isArray(req.body.observacao) ? req.body.observacao : [req.body.observacao];
  var valor = Array.isArray(req.body.valor) ? req.body.valor : [req.body.valor];
  var ambiente = Array.isArray(req.body.ambiente) ? req.body.ambiente : [req.body.ambiente];
  var marca = Array.isArray(req.body.marca) ? req.body.marca : [req.body.marca];
  var modelo = Array.isArray(req.body.modelo) ? req.body.modelo : [req.body.modelo];
  var btus = Array.isArray(req.body.btus) ? req.body.btus : [req.body.btus];
  var prestacao = Array.isArray(req.body.prestacao) ? req.body.prestacao : [req.body.prestacao];
  var quantidade = Array.isArray(req.body.quantidade) ? req.body.quantidade : [req.body.quantidade];
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
        finalizado: finalizado[i],
        colaboradoreId: id,
        clienteId: id,
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
  var data1 = req.body.data1
  var data2 = req.body.data2
  
  
  console.log(chalk.blue.bold('data 1 ' + data1));
  console.log(chalk.blue.bold('data 2 ' + data2))
  res.send('passo')
})

module.exports = router