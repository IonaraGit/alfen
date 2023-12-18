const express = require ('express')
const router = express.Router();

const chalk = require('chalk')

const Orcamento = require ('../models/Orcamento')
const Agenda = require ('../models/Agenda');
const Cliente = require('../models/Cliente');
const Prestacao = require('../models/Prestacao');
const Btu = require ('../models/Btu');
const Marca = require('../models/Marca');
const Ambiente = require('../models/Ambiente');
const Modelo = require('../models/Modelo');
const Endereco = require('../models/Endereco')

const nodemailer = require ('nodemailer')
const fs = require('fs');

const pdf = require('html-pdf');



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

router.post('/agendamentos/deletar', async (req, res) => {
  try {
    const idAgendamento = req.body.id_agendamento;
    const id_cliente_a = req.body.id_cliente_a;
    let msg = 'Agendamentos iniciados e/ou finalizados, não podem ser exluidos!';
    const mgserro = encodeURIComponent(msg)

    if (idAgendamento !== undefined && !isNaN(idAgendamento)) {
      // Obtém o ID do orçamento associado ao agendamento
      const agenda = await Agenda.findOne({
        where: {
          id: idAgendamento
        }
      });

      if (agenda) {
        const orcamentoId = agenda.orcamentoId;

        // Obtém o status do Orçamento
        const orcamento = await Orcamento.findOne({
          where: {
            id: orcamentoId
          }
        });

        if (orcamento) {
          const statusOrcamento = orcamento.status;

          // Verifica se o status do Orçamento é diferente de 2 (iniciado) ou 3 (finalizado)
          if (statusOrcamento !== 2 && statusOrcamento !== 3) {
            // Atualiza o campo status na tabela Orçamento
            await Orcamento.update(
              { status: 0 }, // Defina o valor desejado para o status
              {
                where: {
                  id: orcamentoId
                }
              }
            );

            // Remove o agendamento da tabela Agenda
            await Agenda.destroy({
              where: {
                id: idAgendamento
              }
            });

           res.redirect (`/admin/orcamentos/prosseguir/${id_cliente_a}`)
          } else {
            res.status(400).redirect (`/admin/orcamentos/prosseguir/${id_cliente_a}?error=${mgserro}`)
          }
        } else {
          res.status(404).send('Orçamento não encontrado.');
        }
      } else {
        res.status(404).send('Agendamento não encontrado.');
      }
    } else {
      res.status(400).send('ID de agendamento inválido.');
    }
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).send('Erro interno ao processar a exclusão do agendamento.');
  }
});

router.post('/orcamento/atualizar', async (req, res) => {
  let msg = 'Edição concluida!';
  const testemsg = encodeURIComponent(msg);
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
      
      res.redirect (`/admin/orcamentos/editar/${id}/${orcamentoId}?mensagem=${testemsg}`)

    }

   

  

  

    // Atualize o valor em aberto no banco de dados
   

    
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).send("Erro ao atualizar o orçamento");
  }
});

router.post('/orcamentos/deletar', async (req, res) => {
  try {
    const idOrcamento = req.body.idOrcamento;
    const idCliente = req.body.idCliente;
    
    let msg = 'Orçamentos agendados, inicializados e/ou finalizados, não podem ser exluidos!';
    const mgserro = encodeURIComponent(msg)

    if (idOrcamento !== undefined && !isNaN(idOrcamento)) {
      Agenda.count ({
        where: {
          orcamentoId: idOrcamento
        }
      }).then (count => {
        if ( count > 0) {
          res.redirect (`/admin/orcamentos/decisao2/${idCliente}?error=${mgserro}`)
        } else {
          Orcamento.destroy ({
            where: {
              id: idOrcamento
            }
          }).then(() => {
            res.redirect (`/admin/orcamentos/decisao2/${idCliente}`)
          })
        }
      })
    }else {
      res.send ('Procure o suporte!')
    }

   
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).send('Erro interno ao processar a exclusão do agendamento.');
  }
});


router.post('/orcamento/envio/pdf', (req, res) => {
  const orcamentoIds = req.body.orcamentoCheck;
  const clienteId = req.body.clienteId
  let msg = 'Enviando...';
  const envioEmailMsg = encodeURIComponent (msg)

  // Faça o que for necessário com os IDs no backend
  console.log('IDs dos Orçamentos:', orcamentoIds);

  Orcamento.findAll({
    include: [
      {
        model: Cliente,
      },
      {
        model: Prestacao,
      },
      {
        model: Btu,
      },
      {
        model: Marca,
      },
      {
        model: Modelo,
      },
      {
        model: Ambiente,
      },
      
    ],
  }).then(orcamentos => {
    Cliente.findAll({
      include: [
        {
          model: Endereco
        }
      ]
    }).then (clientes => {
      Prestacao.findAll().then (prestacoes => {
        Btu.findAll().then (btus => {
          Marca.findAll().then (marcas =>{
            Modelo.findAll().then (modelos =>{
              Ambiente.findAll().then(ambientes =>{
                Endereco.findAll().then(enderecos => {
                  const orcamentosSelecionados = orcamentos.filter(orcamento => orcamentoIds.includes(orcamento.id.toString()));
                

                  if (orcamentosSelecionados.length > 0) {
                    const primeiroClienteId = orcamentosSelecionados[0].clienteId;
                    const clienteDoOrcamento = clientes.find(cliente => cliente.id == primeiroClienteId);
          
                    if (clienteDoOrcamento) {
                      const enderecoDoCliente = enderecos.find (endereco => endereco.clienteId == clienteDoOrcamento.id)

                      console.log(chalk.red.bold('Cliente para o e-mail é: ' + clienteDoOrcamento.email));
          
                      // Agora você pode criar o conteúdo do e-mail e do PDF
                      var conteudoEmail = 'Segue anexo, orçamentos!';
                      var conteudoHTML = '';
                                      
                      var headerHTML = `
                      <style>
                      
                      .teste-color {
                        color: #ffffff;
                        border: solid;
                        align-items: start;
                        margin-top: 0;
                        padding-top: 0;
                        background-color: #d9d9d9;
                      }
                      
                      </style>
                      
              
                      <header class="teste-color">
                      
                        
                      <img src='https://raw.githubusercontent.com/IonaraGit/alfen/main/public/img/sistec-orcamento.png' style="width: 254px; margin: 10px;">
                        
                       
                       
                       
                        
                      </header>

                      `;
  
                      var footerHTML = `
                      <style>
                      .footer {
                        
                        bottom: auto;
                        left: 0;
                        width: 100%;
                        text-align: center;
                        padding: 10px;
                        background-color: #f1f1f1;
                      }
                      </style>

                      <div class="footer">
                        <p>Seu rodapé aqui</p>
                      </div>
              
                      `
                      var dadosCliente = `
                      <p style="font-weight: bold">Cliente: <span style="font-weight: 200"> ${clienteDoOrcamento.nome} </span> </p>
                      <p style="font-weight: bold">Endereço: <span style="font-weight: 200"> ${enderecoDoCliente.logadouro}, n° ${enderecoDoCliente.numero} </span> </p>
                      
                      `
          
                      var somaValoresCobrados = 0;
                      var somaValoresAbertos = 0;
                      var somaValoresPagos = 0;
  
                      orcamentosSelecionados.forEach((orcamento, index) => {
                       
  
                        const prestacaoDoOrcamento = prestacoes.find(prestacao => prestacao.id == orcamento.prestacoId);
                        
                        const btuDoOrcamento = btus.find (btu => btu.id == orcamento.btuId)
  
                        const marcaDoOrcamento = marcas.find (marca => marca.id == orcamento.marcaId)
  
                        const modeloDoOrcamento = modelos.find (modelo => modelo.id == orcamento.modeloId)
  
                        const ambienteDoOrcamento = ambientes.find (ambiente => ambiente.id == orcamento.ambienteId)

                       
          
                       // Cria uma tabela para cada orçamento
                        var tabelaOrcamentoHTML = `
  
                        <style>
                          .orcamento-table th,
                          .orcamento-table td {
                            text-align: left;
                            font-family: 'Source Sans Pro', sans-serif;
                          }
                    
                          .orcamento-table th {
                            width: 180px;
                            background-color: #d9d9d9;
                          }
                    
                          .orcamento-table td {
                            width: 450px;
                          }

                          .orcamento-table {
                            margin-top: 15px;
                          }
  
                         
                        
                      
                        </style>
                          <div>
                          <table border="1" class="orcamento-table">
                            <tr>
                              <th>Quantidade</th>
                              <td>${orcamento.qtd}</td>
                            </tr>
                            <tr>
                              <th>Serviço prestado</th>
                              <td>${prestacaoDoOrcamento ? prestacaoDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Btus</th>
                              <td>${btuDoOrcamento ? btuDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Marca</th>
                              <td>${marcaDoOrcamento ? marcaDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Modelo</th>
                              <td>${modeloDoOrcamento ? modeloDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Ambiente</th>
                              <td>${ambienteDoOrcamento ? ambienteDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Observação</th>
                              <td>${orcamento.observacao}</td>
                            </tr>
                            <tr>
                              <th>Valor cobrado</th>
                              <td>R$ ${orcamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                              <th>Valor recebido</th>
                              <td>R$ ${orcamento.valor_recebido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                              <th>Valor em aberto</th>
                              <td>R$ ${orcamento.valor_aberto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                           
                          </table>
                          </div>
  
                          
                          
                        `;
  
                        somaValoresCobrados += orcamento.valor;  
                        somaValoresAbertos += orcamento.valor_aberto;
                        somaValoresPagos += orcamento.valor_recebido
                        
                        conteudoHTML += tabelaOrcamentoHTML;
  
                        // Adiciona uma quebra de página a cada duas tabelas
                        if ((index + 1) % 2 === 0 && index < orcamentosSelecionados.length - 1) {
                          conteudoHTML += 
                          `
                          
                          <div style="page-break-before: always;"><br></div> 
                          ${headerHTML}
                          ${dadosCliente}` ;
                        }
                      });
  
                      var valoresAtualizados = `
                      <br>
                      <table border="1" class="orcamento-table">
                        <tr>
                          <th>Total cobrado</th>
                          <td style='color: red; font-weight: 600;'>R$ ${somaValoresCobrados.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                          <th>Total recebido</th>
                          <td style='color: green; font-weight: 600;'>R$ ${somaValoresPagos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                          <th>Total em aberto</th>
                          <td style='color: blue; font-weight: 600;'>R$ ${somaValoresAbertos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <td colspan="2">
                        <p style="font-weight: bold">OBS: <span style="font-weight: 200">Valores acima mencionados, são refentes a orçamentos contidos neste documento. </span> </p>
                        </td>
                      </table>
                        
                      `;
  
                      conteudoHTML += valoresAtualizados;
                      var testandobr = `
                      <div style="margin-top: 20px"></div>
                      `
                      const pdfOptions = { 
                        format: 'Letter',
                        
                      };
          
                      pdf.create(testandobr + headerHTML + dadosCliente + conteudoHTML, pdfOptions).toFile('orcamento.pdf', (err, res) => {
                        if (err) return console.log(err);
                        console.log(res); // informações sobre o arquivo PDF
                      });
          
                      const transporter = nodemailer.createTransport({
                        service: 'hotmail',
                        auth: {
                          user: 'ionara_002@hotmail.com',
                          pass: 'caixa2103',
                        },
                      });
          
                      const emailOpcao = {
                        from: 'ionara_002@hotmail.com',
                        to: clienteDoOrcamento.email,
                        subject: 'TESTE ORÇAMENTO',
                        text: conteudoEmail,
                        attachments: [
                          {
                            filename: 'orcamento.pdf',
                            content: fs.createReadStream('orcamento.pdf'),
                          },
                          // Você pode adicionar mais anexos aqui, se desejar
                        ],
                      };
          
                      transporter.sendMail(emailOpcao, (err, info) => {
                        if (err) {
                          console.error('Erro ao enviar o e-mail:', err);
                        } else {
                          console.log('E-mail enviado:', info.response);
                        }
                      });
                  
                    }
                  }

                })
              })
            })
          })
        })
     })
    });
  });
   // Envie uma resposta de volta para o frontend, se necessário
   res.redirect (`/admin/orcamentos/envios/${clienteId}?error=${envioEmailMsg}`)
});

router.post('/orcamento/vizualizar', (req, res) => {
  const orcamentoIds = req.body.orcamentoCheck;
  const clienteId = req.body.clienteId
  

  // Faça o que for necessário com os IDs no backend
  console.log('IDs dos Orçamentos:', orcamentoIds);

  Orcamento.findAll({
    include: [
      {
        model: Cliente,
      },
      {
        model: Prestacao,
      },
      {
        model: Btu,
      },
      {
        model: Marca,
      },
      {
        model: Modelo,
      },
      {
        model: Ambiente,
      },
      
    ],
  }).then(orcamentos => {
    Cliente.findAll({
      include: [
        {
          model: Endereco
        }
      ]
    }).then (clientes => {
      Prestacao.findAll().then (prestacoes => {
        Btu.findAll().then (btus => {
          Marca.findAll().then (marcas =>{
            Modelo.findAll().then (modelos =>{
              Ambiente.findAll().then(ambientes =>{
                Endereco.findAll().then(enderecos => {
                  const orcamentosSelecionados = orcamentos.filter(orcamento => orcamentoIds.includes(orcamento.id.toString()));
                

                  if (orcamentosSelecionados.length > 0) {
                    const primeiroClienteId = orcamentosSelecionados[0].clienteId;
                    const clienteDoOrcamento = clientes.find(cliente => cliente.id == primeiroClienteId);
          
                    if (clienteDoOrcamento) {
                      const enderecoDoCliente = enderecos.find (endereco => endereco.clienteId == clienteDoOrcamento.id)

                      
          
                      
                      var conteudoHTML = '';
                                      
                      var headerHTML = `
                      <style>
                      
                      .teste-color {
                        color: #ffffff;
                        border: solid;
                        align-items: start;
                        margin-top: 0;
                        padding-top: 0;
                        background-color: #d9d9d9;
                      }
                      
                      </style>
                      
              
                      <header class="teste-color">
                      
                        
                      <img src='https://raw.githubusercontent.com/IonaraGit/alfen/main/public/img/sistec-orcamento.png' style="width: 254px; margin: 10px;">
                        
                        
                        
                        
                        
                      </header>

                      `;
  
                      var footerHTML = `
                      <style>
                      .footer {
                        
                        bottom: auto;
                        left: 0;
                        width: 100%;
                        text-align: center;
                        padding: 10px;
                        background-color: #f1f1f1;
                      }
                      </style>

                      <div class="footer">
                        <p>Seu rodapé aqui</p>
                      </div>
              
                      `
                      var dadosCliente = `
                      <p style="font-weight: bold">Cliente: <span style="font-weight: 200"> ${clienteDoOrcamento.nome} </span> </p>
                      <p style="font-weight: bold">Endereço: <span style="font-weight: 200"> ${enderecoDoCliente.logadouro}, n° ${enderecoDoCliente.numero} </span> </p>
                      
                      `
          
                      var somaValoresCobrados = 0;
                      var somaValoresAbertos = 0;
                      var somaValoresPagos = 0;
  
                      orcamentosSelecionados.forEach((orcamento, index) => {
                        
  
                        const prestacaoDoOrcamento = prestacoes.find(prestacao => prestacao.id == orcamento.prestacoId);
                        
                        const btuDoOrcamento = btus.find (btu => btu.id == orcamento.btuId)
  
                        const marcaDoOrcamento = marcas.find (marca => marca.id == orcamento.marcaId)
  
                        const modeloDoOrcamento = modelos.find (modelo => modelo.id == orcamento.modeloId)
  
                        const ambienteDoOrcamento = ambientes.find (ambiente => ambiente.id == orcamento.ambienteId)

                        
          
                        // Cria uma tabela para cada orçamento
                        var tabelaOrcamentoHTML = `
  
                        <style>
                          .orcamento-table th,
                          .orcamento-table td {
                            text-align: left;
                            font-family: 'Source Sans Pro', sans-serif;
                          }
                    
                          .orcamento-table th {
                            width: 180px;
                            background-color: #d9d9d9;
                          }
                    
                          .orcamento-table td {
                            width: 450px;
                          }

                          .orcamento-table {
                            margin-top: 15px;
                          }
  
                          
                        
                      
                        </style>
                          <div>
                          <table border="1" class="orcamento-table">
                            <tr>
                              <th>Quantidade</th>
                              <td>${orcamento.qtd}</td>
                            </tr>
                            <tr>
                              <th>Serviço prestado</th>
                              <td>${prestacaoDoOrcamento ? prestacaoDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Btus</th>
                              <td>${btuDoOrcamento ? btuDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Marca</th>
                              <td>${marcaDoOrcamento ? marcaDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Modelo</th>
                              <td>${modeloDoOrcamento ? modeloDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Ambiente</th>
                              <td>${ambienteDoOrcamento ? ambienteDoOrcamento.descricao : 'N/A'}</td>
                            </tr>
                            <tr>
                              <th>Observação</th>
                              <td>${orcamento.observacao}</td>
                            </tr>
                            <tr>
                              <th>Valor cobrado</th>
                              <td>R$ ${orcamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                              <th>Valor recebido</th>
                              <td>R$ ${orcamento.valor_recebido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                              <th>Valor em aberto</th>
                              <td>R$ ${orcamento.valor_aberto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                            
                          </table>
                          </div>
  
                          
                          
                        `;
  
                        somaValoresCobrados += orcamento.valor;  
                        somaValoresAbertos += orcamento.valor_aberto;
                        somaValoresPagos += orcamento.valor_recebido
                        
                        conteudoHTML += tabelaOrcamentoHTML;
  
                        // Adiciona uma quebra de página a cada duas tabelas
                        if ((index + 1) % 2 === 0 && index < orcamentosSelecionados.length - 1) {
                          conteudoHTML += 
                          `
                          
                          <div style="page-break-before: always;"><br></div> 
                          ${headerHTML}
                          ${dadosCliente}` ;
                        }
                      });
  
                      var valoresAtualizados = `
                      <br>
                      <table border="1" class="orcamento-table">
                        <tr>
                          <th>Total cobrado</th>
                          <td style='color: red; font-weight: 600;'>R$ ${somaValoresCobrados.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                          <th>Total recebido</th>
                          <td style='color: green; font-weight: 600;'>R$ ${somaValoresPagos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                          <th>Total em aberto</th>
                          <td style='color: blue; font-weight: 600;'>R$ ${somaValoresAbertos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                        <td colspan="2">
                        <p style="font-weight: bold">OBS: <span style="font-weight: 200">Valores acima mencionados, são refentes a orçamentos contidos neste documento. </span> </p>
                        </td>
                      </table>
                        
                      `;
  
                      
                      var testandobr = `
                      <div style="margin-top: 20px"></div>
                      `
                      const pdfOptions = { 
                        format: 'Letter',
                        
                      };
          
                      pdf.create(testandobr + headerHTML + dadosCliente + conteudoHTML, pdfOptions).toStream((err, stream) => {
                        if (err) {
                          res.status(500).send('Erro ao gerar o PDF');
                          return;
                      }
              
                      res.setHeader('Content-Type', 'application/pdf');
                      stream.pipe(res);
                      });
     
                    }
                  }

                })
              })
            })
          })
        })
      })
    });
  });
    // Envie uma resposta de volta para o frontend, se necessário
    //res.redirect (`/admin/orcamentos/envios/${clienteId}`)
});
















module.exports = router