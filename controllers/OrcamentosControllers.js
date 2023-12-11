const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Orcamento = require ('../models/Orcamento')
const Agenda = require ('../models/Agenda');
const Cliente = require('../models/Cliente');

const nodemailer = require ('nodemailer')
const fs = require('fs');
const PDFDocument = require('pdfkit');

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
  var status = 0;
  var valor_recebido = 0;

  const conta = quantidade.length;
  const para = observacao.length;
 

  let msg = 'Salvo com sucesso';

  console.log(chalk.red.bold(`VALOR ${valor}`));
  const encodedMsg = encodeURIComponent(msg);
  
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
        status: status,
        colaboradoreId: colaboradoreId[i],
        clienteId: clienteId[i],
        empresaId: empresaId[i],
        valor_recebido: valor_recebido,
        valor_aberto: converte
      })
    );
  }

  Promise.all(orcamento)
    .then(() => {
      console.log('Orçamentos criados com sucesso.');


      res.redirect (`/admin/orcamentos/decisao2/${id}?mensagem=${encodedMsg}`)
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
            {status: 1},
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

router.post('/orcamento/atualizar', async (req, res) => {
  try {
    const {
      id,
      quantidade,
      prestacao,
      btus,
      marca,
      modelo,
      ambiente,
      valor,
      observacao,
      orcamentoId,
      valor_aberto
    } = req.body;

   

    console.log (chalk.blue.bold ('valor que esta em aberto ', valor_aberto ))

    const valorAlterado = parseFloat(valor.replace(/\./g, '').replace(',', '.'));

    let msg = 'O valor total do orçamento não pode ser menor que o valor já recebido!';

    if (valorAlterado < valor_aberto) {
      // Codificar a mensagem na URL
      const encodedMsg = encodeURIComponent(msg);
      res.redirect(`/admin/orcamentos/editar/${id}/${orcamentoId}?error=${encodedMsg}`);
      
    } else {
      
       // Obtenha o orçamento atual para calcular a diferença no valor
      const orcamentoAtual = await Orcamento.findByPk(orcamentoId);

      if (!orcamentoAtual) {
        return res.send("Orçamento não encontrado");
      }

      // Calcule a diferença no valor
      const diferencaValor = valorAlterado - orcamentoAtual.valor;
      // Atualize o orçamento
      await Orcamento.update({
        qtd: quantidade,
        valor: valorAlterado,
        observacao: observacao,
        marcaId: marca,
        modeloId: modelo,
        prestacoId: prestacao,
        ambienteId: ambiente,
        btuId: btus
      }, {
        where: {
          id: orcamentoId
        }
      });

        // Atualize o valor em aberto considerando a diferença
      const novoValorAberto = orcamentoAtual.valor_aberto + diferencaValor;
      await Orcamento.update({
        valor_aberto: novoValorAberto
      }, {
        where: {
          id: orcamentoId
        }
      });
      res.send("Orçamento atualizado com sucesso!");
    }

   

  

  

    // Atualize o valor em aberto no banco de dados
   

    
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).send("Erro ao atualizar o orçamento");
  }
});


router.post('/orcamento/envio/pdf', (req, res) => {

  const orcamentoIds = req.body.orcamentoCheck;

  // Faça o que for necessário com os IDs no backend
  console.log('IDs dos Orçamentos:', orcamentoIds);



  Orcamento.findAll({
    include: [
      {
        model: Cliente,
      },
    ],
  }).then(orcamentos => {
    Cliente.findAll().then(clientes => {

      orcamentos.forEach(orcamento => {
        if (orcamentoIds.includes(orcamento.id.toString())) {
          clientes.forEach(cliente => {
            if (cliente.id == orcamento.clienteId) {
              console.log(chalk.red.bold('Aqui foi ' + orcamento.id +' o cliente é: ' + orcamento.clienteId + ' e o e-mail é: ' + cliente.email));

              var conteudo = ` ID ORÇAMANTO = ${orcamento.id}`

              

            }
          })

          
        }
      });

    })
    
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth:{
        user: 'ionara_002@hotmail.com',
        pass: 'caixa2103'
      }
    })
              
    const emailop ={
      from: 'ionara_002@hotmail.com',
      to: cliente.email,
      subject: 'TESTE ORÇAMENTO',
      text: conteudo
    }
    
    transporter.sendMail(emailop, (err, info) => {
      if (err) {
        console.error('Erro ao enviar o e-mail:', err);
      } else {
        console.log('E-mail enviado:', info.response);
      }
    })

    res.send ('ok')
  });
});






module.exports = router