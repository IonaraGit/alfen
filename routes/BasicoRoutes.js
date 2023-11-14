const express = require ('express')
const router = express.Router();
const Cliente = require ('../models/Cliente')
const Endereco = require ('../models/Endereco')
const Origem = require ('../models/Origem')
const Colaborador = require('../models/Colaborador');
const Marca = require ('../models/Marca');
const Modelo = require ('../models/Modelo');
const Orcamento = require('../models/Orcamento');
const Ambiente = require('../models/Ambiente');
const Prestacao = require('../models/Prestacao');
const Btu = require('../models/Btu');



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
  res.render('sistema/login')
})

router.get('/acesso/adm', (req, res) =>{
  res.render('sistema/admin')
})

router.get('/acesso/adm/clientes', (req, res) =>{
  Cliente.findAll().then(clientes => {
    res.render('sistema/clientes', {clientes:clientes})
  })
})

router.get('/acesso/cliente/orcamento', (req, res) => {
  res.render('sistema/orcamento')
})
/*** FIM SISTEMA */

/* CLIENTES */
router.get('/admin/cliente/novo', (req, res) => {
  var msg = req.query.msg;
  Cliente.findAll().then(clientes => {
    Endereco.findAll().then(enderecos => {
      Origem.findAll().then(origens => {
        res.render('cliente/novo', {clientes:clientes, enderecos:enderecos, origens:origens, msg:msg})
      })
    })
  })
})

router.get('/admin/cliente/detalhes/:id', (req, res) => {
  var id = req.params.id

  Cliente.findByPk(id).then (cliente => {
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
                        res.render('cliente/detalhes', {cliente:cliente, enderecos:enderecos, origens:origens, orcamentos: orcamentos, prestacoes: prestacoes, colaboradores: colaboradores, btus: btus, marcas:marcas, modelos: modelos, ambientes:ambientes})
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
      res.send ('erro')
    }
  })
})
/*** FIM CLIENTES */


/* ORCAMENTOS */
router.get('/admin/orcamento/novo/:id', (req, res) => {
  var id = req.params.id

  Cliente.findByPk(id).then (cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Ambiente.findAll().then(ambientes => {
                Prestacao.findAll().then(prestacoes => {
                  Btu.findAll().then(btus => {
                    res.render('orcamento/novo', {cliente:cliente, enderecos:enderecos, origens:origens, marcas:marcas, modelos:modelos, ambientes: ambientes, prestacoes:prestacoes, btus:btus})
                  })
                })
              })
            })
          })
        })
      })
    } else {
      res.send ('erro')
    } 
  })
})

router.get ('/admin/orcamentos/prosseguir/:id', (req, res) => {
  var id = req.params.id

  Cliente.findByPk(id).then (cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Orcamento.findAll().then(orcamentos => {
                Colaborador.findAll().then(colaboradores => {
                  res.render('orcamento/prosseguir', {cliente:cliente, enderecos:enderecos, origens:origens, marcas:marcas, modelos:modelos, orcamentos: orcamentos, colaboradores: colaboradores})
                })
              })
              
            })
          })
         
        })
      })
    } else {
      res.send ('erro')
    } 
  })
})

router.get ('/admin/orcamentos/decisao/:id', (req, res) => {
  var id = req.params.id

  Cliente.findByPk(id).then (cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Orcamento.findAll().then(orcamentos => {
                Colaborador.findAll().then(colaboradores => {
                  res.render('orcamento/decisao', {cliente:cliente, enderecos:enderecos, origens:origens, marcas:marcas, modelos:modelos, orcamentos: orcamentos, colaboradores: colaboradores, id})
                })
              })
              
            })
          })
         
        })
      })
    } else {
      res.send ('erro')
    } 
  })
})

router.get ('/admin/orcamentos/prosseguir/:id', (req, res) => {
  var id = req.params.id

  Cliente.findByPk(id).then (cliente => {
    if (cliente != undefined) {
      Endereco.findAll().then(enderecos => {
        Origem.findAll().then(origens => {
          Marca.findAll().then(marcas => {
            Modelo.findAll().then(modelos => {
              Orcamento.findAll().then(orcamentos => {
                Colaborador.findAll().then(colaboradores => {
                  res.render('orcamento/prosseguir', {cliente:cliente, enderecos:enderecos, origens:origens, marcas:marcas, modelos:modelos, orcamentos: orcamentos, colaboradores: colaboradores})
                })
              })
              
            })
          })
         
        })
      })
    } else {
      res.send ('erro')
    } 
  })
})
/*** FIM ORCAMENTOS */

/* INICIO COLABORADORES */
router.get('/acesso/adm/colaboradores', (req, res) =>{
  Colaborador.findAll().then(colaboradores => {
    res.render('colaborador/index', {colaboradores:colaboradores})
  })
})

router.get('/admin/colaborador/:id', (req, res) => {
  var id = req.params.id
  Colaborador.findByPk(id).then (colaborador => {
  res.render('colaborador/detalhes', {colaborador: colaborador})
  })
})
/*** FIM COLABORADORES */

/* INICIO AMBIENTE */
router.get('/acesso/adm/ambientes', (req, res) =>{
  Ambiente.findAll().then(ambientes => {
    res.render('ambiente/index', {ambientes:ambientes})
  })
})

router.get('/admin/ambiente/:id', (req, res) => {
  var id = req.params.id
  Ambiente.findByPk(id).then (ambiente => {
  res.render('ambiente/detalhes', {ambiente: ambiente})
  })
})
/*** FIM AMBIENTE */

/* INICIO MODELO */
router.get('/acesso/adm/modelos', (req, res) =>{
  Modelo.findAll().then(modelos => {
    res.render('modelo/index', {modelos:modelos})
  })
})

router.get('/admin/modelo/:id', (req, res) => {
  var id = req.params.id
  Modelo.findByPk(id).then (modelo => {
  res.render('modelo/detalhes', {modelo: modelo})
  })
})
/*** FIM MODELO */

/* INICIO MODELO */
router.get('/acesso/adm/marcas', (req, res) =>{
  Marca.findAll().then(marcas => {
    res.render('marca/index', {marcas:marcas})
  })
})

router.get('/admin/marca/:id', (req, res) => {
  var id = req.params.id
  Marca.findByPk(id).then (marca => {
  res.render('marca/detalhes', {marca: marca})
  })
})
/*** FIM MODELO */

/* INICIO PRESTACAO */
router.get('/acesso/adm/prestacoes', (req, res) =>{
  Prestacao.findAll().then(prestacoes => {
    res.render('prestacao/index', {prestacoes:prestacoes})
  })
})

router.get('/admin/prestacao/:id', (req, res) => {
  var id = req.params.id
  Prestacao.findByPk(id).then (prestacao => {
  res.render('prestacao/detalhes', {prestacao: prestacao})
  })
})
/*** FIM PRESTACAO */

/* INICIO ORIGEM */
router.get('/acesso/adm/origens', (req, res) =>{
  Origem.findAll().then(origens => {
    res.render('origem/index', {origens:origens})
  })
})

router.get('/admin/origem/:id', (req, res) => {
  var id = req.params.id
  Origem.findByPk(id).then (origem => {
  res.render('origem/detalhes', {origem: origem})
  })
})
/*** FIM ORIGEM */

/* INICIO BTU */
router.get('/acesso/adm/btus', (req, res) =>{
  Btu.findAll().then(btus => {
    res.render('btu/index', {btus:btus})
  })
})

router.get('/admin/btu/:id', (req, res) => {
  var id = req.params.id
  Btu.findByPk(id).then (btu => {
  res.render('btu/detalhes', {btu: btu})
  })
})
/*** FIM BTU */


module.exports = router