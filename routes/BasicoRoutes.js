const express = require('express')
const router = express.Router()
const Cliente = require('../models/Cliente')
const Endereco = require('../models/Endereco')
const Origem = require('../models/Origem')
const Colaborador = require('../models/Colaborador')
const Marca = require('../models/Marca')
const Modelo = require('../models/Modelo')
const Orcamento = require('../models/Orcamento')
const Ambiente = require('../models/Ambiente')
const Prestacao = require('../models/Prestacao')
const Empresa = require('../models/Empresa')
const Btu = require('../models/Btu')
const Agenda = require('../models/Agenda')
const Pagamento = require('../models/Pagamento')
const Recebimento = require('../models/Recebimento')
const Estoque = require('../models/Estoque')
const Medida = require('../models/Medida')
const Pergunta = require('../models/Pergunta')

const expirar = require('../middlewares/expirar')
const Comentario = require('../models/Comentario')

/* INICIO BASICOS */
router.get('/faleconosco', (req, res) => {
  res.render('informacao/faleconosco')
})

router.get('/quemsomos', (req, res) => {
  res.render('informacao/quemsomos')
})

router.get('/inicio', (req, res) => {
  res.render('informacao/index')
})
/*** FIM BASICOS */

/* INICIO SISTEMA */
router.get('/acesso', (req, res) => {
  const mensagem = req.query.mensagem
  const mensagemcolaborador = req.query.mensagemcolaborador
  const errorMessage = req.query.error
  res.render('sistema/login', { mensagem, mensagemcolaborador, errorMessage })
})

router.get('/acesso/adm', expirar, (req, res) => {
  sessao = req.session.colaborador
  Agenda.findAll().then(agendas => {
    Cliente.findAll().then(clientes => {
      Prestacao.findAll().then(prestacoes => {
        Colaborador.findAll().then(colaboradores => {
          Orcamento.findAll().then(orcamentos => {
            Recebimento.findAll().then(recebimentos => {
              res.render('sistema/admin', {
                agendas: agendas,
                clientes: clientes,
                prestacoes: prestacoes,
                colaboradores: colaboradores,
                orcamentos: orcamentos,
                recebimentos: recebimentos,
                sessao
              })
            })
          })
        })
      })
    })
  })
})

router.get('/acesso/adm/clientes', (req, res) => {
  sessao = req.session.colaborador
  Cliente.findAll().then(clientes => {
    Empresa.findAll().then(empresas => {
      res.render('sistema/clientes', {
        clientes: clientes,
        empresas: empresas,
        sessao
      })
    })
  })
})

router.get('/acesso/cliente/orcamento', (req, res) => {
  res.render('sistema/orcamento')
})

router.get('/acesso/colaborador', expirar, (req, res) => {
  sessao = req.session.colaborador
  Agenda.findAll().then(agendas => {
    Cliente.findAll().then(clientes => {
      Prestacao.findAll().then(prestacoes => {
        Colaborador.findAll().then(colaboradores => {
          Orcamento.findAll().then(orcamentos => {
            Comentario.findAll().then(comentarios => {
              Endereco.findAll().then(enderecos => {
                res.render('sistema/colaborador', {
                  agendas: agendas,
                  clientes: clientes,
                  prestacoes: prestacoes,
                  colaboradores: colaboradores,
                  orcamentos: orcamentos,
                  comentarios: comentarios,
                  enderecos: enderecos,
                  sessao
              })
              
              })
            })
          })
        })
      })
    })
  })
})
/*** FIM SISTEMA */

/* CLIENTES */
router.get('/admin/cliente/novo', (req, res) => {
  var msg = req.query.msg
  sessao = req.session.colaborador
  Cliente.findAll().then(clientes => {
    Endereco.findAll().then(enderecos => {
      Origem.findAll().then(origens => {
        Empresa.findAll().then(empresas => {
          res.render('cliente/novo', {
            clientes: clientes,
            enderecos: enderecos,
            origens: origens,
            msg: msg,
            empresas: empresas,
            sessao
          })
        })
      })
    })
  })
})

router.get('/admin/cliente/detalhes/:id', (req, res) => {
  var id = req.params.id
  sessao = req.session.colaborador
  Cliente.findByPk(id).then(cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Orcamento.findAll().then(orcamentos => {
            Prestacao.findAll().then(prestacoes => {
              Colaborador.findAll().then(colaboradores => {
                Btu.findAll().then(btus => {
                  Marca.findAll().then(marcas => {
                    Modelo.findAll().then(modelos => {
                      Ambiente.findAll().then(ambientes => {
                        res.render('cliente/detalhes', {
                          cliente: cliente,
                          enderecos: enderecos,
                          origens: origens,
                          orcamentos: orcamentos,
                          prestacoes: prestacoes,
                          colaboradores: colaboradores,
                          btus: btus,
                          marcas: marcas,
                          modelos: modelos,
                          ambientes: ambientes,
                          sessao
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    } else {
      res.send('erro')
    }
  })
})
/*** FIM CLIENTES */

/* ORCAMENTOS */
router.get('/admin/orcamento/novo/:id', expirar, (req, res) => {
  var id = req.params.id
  sessao = req.session.colaborador
  const errorMessage = req.query.error
  Cliente.findByPk(id).then(cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Ambiente.findAll().then(ambientes => {
                Prestacao.findAll().then(prestacoes => {
                  Btu.findAll().then(btus => {
                    res.render('orcamento/novo', {
                      cliente: cliente,
                      enderecos: enderecos,
                      origens: origens,
                      marcas: marcas,
                      modelos: modelos,
                      ambientes: ambientes,
                      prestacoes: prestacoes,
                      btus: btus,
                      sessao,
                      errorMessage
                    })
                  })
                })
              })
            })
          })
        })
      })
    } else {
      res.send('erro')
    }
  })
})

router.get('/admin/orcamentos/prosseguir/:id', (req, res) => {
  var id = req.params.id
  const errorMessage = req.query.error
  const mensagem = req.query.mensagem

  Cliente.findByPk(id).then(cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Orcamento.findAll().then(orcamentos => {
                Colaborador.findAll().then(colaboradores => {
                  Prestacao.findAll().then(prestacoes => {
                    Btu.findAll().then(btus => {
                      Ambiente.findAll().then(ambientes => {
                        Agenda.findAll().then(agendas => {
                          res.render('orcamento/prosseguir', {
                            cliente: cliente,
                            enderecos: enderecos,
                            origens: origens,
                            marcas: marcas,
                            modelos: modelos,
                            orcamentos: orcamentos,
                            colaboradores: colaboradores,
                            prestacoes: prestacoes,
                            btus: btus,
                            ambientes: ambientes,
                            agendas: agendas,
                            errorMessage,
                            mensagem
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    } else {
      res.send('erro')
    }
  })
})

router.get('/admin/orcamentos/decisao/:id', (req, res) => {
  var id = req.params.id
  sessao = req.session.colaborador
  Cliente.findByPk(id).then(cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Orcamento.findAll().then(orcamentos => {
                Colaborador.findAll().then(colaboradores => {
                  Prestacao.findAll().then(prestacoes => {
                    Btu.findAll().then(btus => {
                      Ambiente.findAll().then(ambientes => {
                        res.render('orcamento/decisao', {
                          cliente: cliente,
                          enderecos: enderecos,
                          origens: origens,
                          marcas: marcas,
                          modelos: modelos,
                          orcamentos: orcamentos,
                          colaboradores: colaboradores,
                          prestacoes: prestacoes,
                          btus: btus,
                          ambientes: ambientes,
                          id,
                          sessao
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    } else {
      res.send('erro')
    }
  })
})

router.get('/admin/orcamentos/decisao2/:id', (req, res) => {
  var id = req.params.id
  sessao = req.session.colaborador
  const mensagem = req.query.mensagem // Obter mensagem da URL
  const errorMessage = req.query.error
  Cliente.findByPk(id).then(cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Orcamento.findAll().then(orcamentos => {
                Colaborador.findAll().then(colaboradores => {
                  Prestacao.findAll().then(prestacoes => {
                    Btu.findAll().then(btus => {
                      Ambiente.findAll().then(ambientes => {
                        res.render('orcamento/decisao2', {
                          cliente: cliente,
                          enderecos: enderecos,
                          origens: origens,
                          marcas: marcas,
                          modelos: modelos,
                          orcamentos: orcamentos,
                          colaboradores: colaboradores,
                          prestacoes: prestacoes,
                          btus: btus,
                          ambientes: ambientes,
                          id,
                          sessao,
                          mensagem,
                          errorMessage
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    } else {
      res.send('erro')
    }
  })
})

router.get('/admin/orcamentos/prosseguir/:id', (req, res) => {
  var id = req.params.id

  Cliente.findByPk(id).then(cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Orcamento.findAll().then(orcamentos => {
                Colaborador.findAll().then(colaboradores => {
                  res.render('orcamento/prosseguir', {
                    cliente: cliente,
                    enderecos: enderecos,
                    origens: origens,
                    marcas: marcas,
                    modelos: modelos,
                    orcamentos: orcamentos,
                    colaboradores: colaboradores
                  })
                })
              })
            })
          })
        })
      })
    } else {
      res.send('erro')
    }
  })
})

router.get(
  '/admin/orcamentos/editar/:id/:orcamento_id',
  expirar,
  (req, res) => {
    const mensagem = req.query.mensagem // Obter mensagem da URL
    var id = req.params.id
    var orcamento_id = req.params.orcamento_id // Corrigi o typo aqui (de oid para orcamento_id)
    sessao = req.session.colaborador
    const errorMessage = req.query.error

    Cliente.findByPk(id).then(cliente => {
      if (cliente != undefined) {
        // Buscar o orcamento pelo ID
        Orcamento.findByPk(orcamento_id).then(orcamento => {
          if (orcamento != undefined) {
            Endereco.findAll().then(enderecos => {
              Origem.findAll().then(origens => {
                Marca.findAll().then(marcas => {
                  Modelo.findAll().then(modelos => {
                    Colaborador.findAll().then(colaboradores => {
                      Prestacao.findAll().then(prestacoes => {
                        Btu.findAll().then(btus => {
                          Ambiente.findAll().then(ambientes => {
                            Pagamento.findAll().then(pagamentos => {
                              Recebimento.findAll().then(recebimentos => {
                                res.render('orcamento/editar', {
                                  cliente: cliente,
                                  enderecos: enderecos,
                                  origens: origens,
                                  marcas: marcas,
                                  modelos: modelos,
                                  orcamento: orcamento,
                                  colaboradores: colaboradores,
                                  prestacoes: prestacoes,
                                  btus: btus,
                                  ambientes: ambientes,
                                  id: id,
                                  sessao: sessao,
                                  orcamento_id: orcamento_id,
                                  pagamentos: pagamentos,
                                  recebimentos: recebimentos,
                                  errorMessage,
                                  mensagem
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          } else {
            res.send('Orcamento não encontrado')
          }
        })
      } else {
        res.send('Cliente não encontrado')
      }
    })
  }
)

router.get(
  '/admin/orcamentos/pagamento/:id/:orcamento_id',
  expirar,
  (req, res) => {
    var id = req.params.id
    var orcamento_id = req.params.orcamento_id // Corrigi o typo aqui (de oid para orcamento_id)
    sessao = req.session.colaborador

    const errorMessage = req.query.error

    Cliente.findByPk(id).then(cliente => {
      if (cliente != undefined) {
        // Buscar o orcamento pelo ID
        Orcamento.findByPk(orcamento_id).then(orcamento => {
          if (orcamento != undefined) {
            Endereco.findAll().then(enderecos => {
              Origem.findAll().then(origens => {
                Marca.findAll().then(marcas => {
                  Modelo.findAll().then(modelos => {
                    Colaborador.findAll().then(colaboradores => {
                      Prestacao.findAll().then(prestacoes => {
                        Btu.findAll().then(btus => {
                          Ambiente.findAll().then(ambientes => {
                            Pagamento.findAll().then(pagamentos => {
                              Recebimento.findAll().then(recebimentos => {
                                res.render('orcamento/pagamento', {
                                  cliente: cliente,
                                  enderecos: enderecos,
                                  origens: origens,
                                  marcas: marcas,
                                  modelos: modelos,
                                  orcamento: orcamento,
                                  colaboradores: colaboradores,
                                  prestacoes: prestacoes,
                                  btus: btus,
                                  ambientes: ambientes,
                                  id: id,
                                  sessao: sessao,
                                  orcamento_id: orcamento_id,
                                  pagamentos: pagamentos,
                                  recebimentos: recebimentos,
                                  errorMessage
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          } else {
            res.send('Orcamento não encontrado')
          }
        })
      } else {
        res.send('Cliente não encontrado')
      }
    })
  }
)

/*** FIM ORCAMENTOS */

/* INICIO COLABORADORES */
router.get('/acesso/adm/colaboradores', expirar, (req, res) => {
  sessao = req.session.colaborador
  Colaborador.findAll().then(colaboradores => {
    Empresa.findAll().then(empresas => {
      res.render('colaborador/index', {
        colaboradores: colaboradores,
        empresas: empresas,
        sessao
      })
    })
  })
})

router.get('/admin/colaborador/:id', (req, res) => {
  var id = req.params.id
  Colaborador.findByPk(id).then(colaborador => {
    res.render('colaborador/detalhes', { colaborador: colaborador })
  })
})
/*** FIM COLABORADORES */

/* INICIO AMBIENTE */

router.get('/acesso/adm/ambientes', expirar, (req, res) => {
  sessao = req.session.colaborador
  Ambiente.findAll().then(ambientes => {
    Empresa.findAll().then(empresas => {
      res.render('ambiente/index', {
        ambientes: ambientes,
        empresas: empresas,
        sessao
      })
    })
  })
})

router.get('/admin/ambiente/:id', (req, res) => {
  var id = req.params.id
  Ambiente.findByPk(id).then(ambiente => {
    res.render('ambiente/detalhes', { ambiente: ambiente })
  })
})
/*** FIM AMBIENTE */

/* INICIO MODELO */
router.get('/acesso/adm/modelos', expirar, (req, res) => {
  sessao = req.session.colaborador
  Modelo.findAll().then(modelos => {
    Empresa.findAll().then(empresas => {
      res.render('modelo/index', {
        modelos: modelos,
        empresas: empresas,
        sessao
      })
    })
  })
})

router.get('/admin/modelo/:id', (req, res) => {
  var id = req.params.id
  Modelo.findByPk(id).then(modelo => {
    res.render('modelo/detalhes', { modelo: modelo })
  })
})
/*** FIM MODELO */

/* INICIO MODELO */
router.get('/acesso/adm/marcas', expirar, (req, res) => {
  Marca.findAll().then(marcas => {
    sessao = req.session.colaborador
    Empresa.findAll().then(empresas => {
      res.render('marca/index', { marcas: marcas, empresas: empresas, sessao })
    })
  })
})

router.get('/admin/marca/:id', (req, res) => {
  var id = req.params.id
  Marca.findByPk(id).then(marca => {
    res.render('marca/detalhes', { marca: marca })
  })
})
/*** FIM MODELO */

/* INICIO PRESTACAO */
router.get('/acesso/adm/prestacoes', expirar, (req, res) => {
  sessao = req.session.colaborador
  Prestacao.findAll().then(prestacoes => {
    Empresa.findAll().then(empresas => {
      res.render('prestacao/index', {
        prestacoes: prestacoes,
        empresas: empresas,
        sessao
      })
    })
  })
})

router.get('/admin/prestacao/:id', (req, res) => {
  var id = req.params.id
  Prestacao.findByPk(id).then(prestacao => {
    res.render('prestacao/detalhes', { prestacao: prestacao })
  })
})
/*** FIM PRESTACAO */

/* INICIO ORIGEM */
router.get('/acesso/adm/origens', expirar, (req, res) => {
  sessao = req.session.colaborador
  Origem.findAll().then(origens => {
    Empresa.findAll().then(empresas => {
      res.render('origem/index', {
        origens: origens,
        empresas: empresas,
        sessao
      })
    })
  })
})

router.get('/admin/origem/:id', (req, res) => {
  var id = req.params.id
  Origem.findByPk(id).then(origem => {
    res.render('origem/detalhes', { origem: origem })
  })
})
/*** FIM ORIGEM */

/* INICIO BTU */
router.get('/acesso/adm/btus', expirar, (req, res) => {
  sessao = req.session.colaborador
  Btu.findAll().then(btus => {
    Empresa.findAll().then(empresas => {
      res.render('btu/index', { btus: btus, empresas: empresas, sessao })
    })
  })
})

router.get('/admin/btu/:id', (req, res) => {
  var id = req.params.id
  Btu.findByPk(id).then(btu => {
    res.render('btu/detalhes', { btu: btu })
  })
})
/*** FIM BTU */

/* INICIO PAGAMENTO */
router.get('/acesso/adm/pagamentos', expirar, (req, res) => {
  sessao = req.session.colaborador
  Pagamento.findAll().then(pagamentos => {
    Empresa.findAll().then(empresas => {
      res.render('pagamento/index', {
        pagamentos: pagamentos,
        empresas: empresas,
        sessao
      })
    })
  })
})

router.get('/admin/pagamento/:id', (req, res) => {
  var id = req.params.id
  Pagamento.findByPk(id).then(pagamento => {
    res.render('pagamento/detalhes', { pagamento: pagamento })
  })
})
/*** FIM PAGAMENTO */

/* INICIO LOGIN */

router.get('/alterarsenha', (req, res) => {
  Pergunta.findAll().then(perguntas => {
    res.render('senha/index', { perguntas: perguntas })
  })
})

router.get('/recuperarsenha', (req, res) => {
  Pergunta.findAll().then(perguntas => {
    res.render('senha/recuperar', { perguntas: perguntas })
  })
})

router.get('/recuperando/passo1', (req, res) => {
  const mensagemcolaborador = req.query.mensagemcolaborador
  const errorMessage = req.query.error
  res.render('senha/recuperando1', { mensagemcolaborador, errorMessage })
})

router.get('/recuperando/passo2/:empresa/:cpf/:pergunta', (req, res) => {
  var empresa = req.params.empresa
  var cpf = req.params.cpf
  var pergunta = req.params.pergunta
  const mensagemcolaborador = req.query.mensagemcolaborador
  const errorMessage = req.query.error

  res.render('senha/recuperando2', {
    empresa,
    cpf,
    pergunta,
    mensagemcolaborador,
    errorMessage
  })
})

router.get(
  '/recuperando/passo3/:empresa/:cpf/:pergunta/:resposta',
  (req, res) => {
    var empresa = req.params.empresa
    var cpf = req.params.cpf
    var pergunta = req.params.pergunta
    var resposta = req.params.resposta

    res.render('senha/recuperando3', { empresa, cpf, pergunta, resposta })
  }
)

/*** FIM LOGIN */

/* INICIO ENVIOS */

router.get('/admin/orcamentos/envios/:id', (req, res) => {
  var id = req.params.id
  sessao = req.session.colaborador
  const mensagem = req.query.mensagem // Obter mensagem da URL
  const errorMessage = req.query.error
  Cliente.findByPk(id).then(cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Orcamento.findAll().then(orcamentos => {
                Colaborador.findAll().then(colaboradores => {
                  Prestacao.findAll().then(prestacoes => {
                    Btu.findAll().then(btus => {
                      Ambiente.findAll().then(ambientes => {
                        res.render('envios/index', {
                          cliente: cliente,
                          enderecos: enderecos,
                          origens: origens,
                          marcas: marcas,
                          modelos: modelos,
                          orcamentos: orcamentos,
                          colaboradores: colaboradores,
                          prestacoes: prestacoes,
                          btus: btus,
                          ambientes: ambientes,
                          id,
                          sessao,
                          mensagem,
                          errorMessage
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    } else {
      res.send('erro')
    }
  })
})

/*** FIM ENVIOS */

/* INICIO ESTOQUE */
router.get('/acesso/adm/estoque', expirar, (req, res) => {
  sessao = req.session.colaborador
  Estoque.findAll().then(estoques => {
    Empresa.findAll().then(empresas => {
      Medida.findAll().then(medidas => {
        res.render('estoque/index', {
          estoques: estoques,
          empresas: empresas,
          medidas: medidas,
          sessao
        })
      })
    })
  })
})

router.get('/admin/estoque/:id', (req, res) => {
  var id = req.params.id
  Estoque.findByPk(id).then(estoque => {
    res.render('estoque/detalhes', { estoque: estoque })
  })
})
/*** FIM ESTOQUE */

module.exports = router
