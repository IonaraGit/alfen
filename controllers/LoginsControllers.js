const express = require ('express')
const router = express.Router();

const bcrypt = require ('bcryptjs')

const chalk = require('chalk')

const Colaborador = require ('../models/Colaborador')
const Cliente = require ('../models/Cliente')
const Empresa = require ('../models/Empresa');
const Pergunta = require('../models/Pergunta');


router.post('/autenticacao', (req, res) => {
  var cpf = req.body.cpf;
  var senha = req.body.senha;
  var empresa = req.body.empresa;
  let mensagemcolaborador = 'Verifique seus dados e tente novamente.';
  const encodedMsg = encodeURIComponent(mensagemcolaborador);
 
  Colaborador.findOne({
    where: {
      cpf: cpf,
      ativo: 1
    }
  }).then(colaborador => {
    if (colaborador != undefined) {
      // Agora, encontre a empresa com base na identificação
      Empresa.findOne({
        where: {
          identificacao: empresa
        }
      }).then(empresaEncontrada => {
        if (empresaEncontrada != undefined) {
          // Agora, você tem o colaborador e a empresa
          if (colaborador.primeiro_acesso == 0) {
            sessao = req.session.colaborador = {
              cpf: colaborador.cpf,
              resposta: colaborador.resposta,
              id: colaborador.id,
              empresaId: colaborador.empresaId
            }
          }

          var correto = bcrypt.compareSync(senha, colaborador.senha);

          if (correto) {
            sessao = req.session.colaborador = {
              id: colaborador.id,
              cpf: colaborador.cpf,
              nome: colaborador.nome,
              empresaId: colaborador.empresaId,
              permissoId: colaborador.permissoId 

              
            }
          } else {
            console.log(chalk.red.bold('Senhas não iguais'));
            console.log('Senha do banco de dados:', colaborador.senha);
            console.log('Senha fornecida:', senha);
          }
          
          
          if ((colaborador.permissoId == 1) && (colaborador.ativo == 1) && (colaborador.primeiro_acesso == 1)) {
            res.redirect('/acesso/adm')
          } else if ((colaborador.permissoId == 2) && (colaborador.ativo == 1) && (colaborador.primeiro_acesso == 1)) {
            res.send ('É do geral, crirar uma pagina para ele')
          } else if ((colaborador.permissoId == 1) && (colaborador.ativo == 1) && (colaborador.primeiro_acesso == 0)) {
            res.redirect('/alterarsenha')
          } else if ((colaborador.permissoId == 2) && (colaborador.ativo == 1) && (colaborador.primeiro_acesso == 0)) {
            res.redirect('/alterarsenha')
          } else if (colaborador.ativo == 0){
            console.log ('você não tem acesso a esse sistema!')
            res.redirect (`/acesso?mensagemcolaborador=${encodedMsg}`)
          }
        } else {
          console.log('Empresa não encontrada');
          res.redirect (`/acesso?mensagemcolaborador=${encodedMsg}`)
        }
      });
    } else {
      console.log('Colaborador não encontrado');
      res.redirect (`/acesso?mensagemcolaborador=${encodedMsg}`)
    }
  });
});

router.post('/salvarnovasenha', (req, res) => {
  var empresa = req.body.empresa;
  var cpf = req.body.cpf;
  var pergunta = req.body.pergunta;
  var resposta = req.body.resposta;
  var senha = req.body.senha;
  const hash = bcrypt.hashSync(senha, 10);
  
  Empresa.findOne({
    where: {
      identificacao: empresa
    }
  }).then(empresaEncontrada => {
    if (empresaEncontrada !== undefined) {
      console.log(chalk.red.bold(`SENHAA: ${senha}`))
      Colaborador.findOne({
        where: {
          cpf: cpf,
          empresaId: empresaEncontrada.id,
        }
      }).then(colaborador => {
        if (colaborador !== null) {
          if ((colaborador.primeiro_acesso === false) && (colaborador.ativo === true)) {
            
            Colaborador.update ({
              pergunta: pergunta,
              resposta: resposta,
              senha: hash,
              primeiro_acesso: 1
            
            }, {
              where: {
                cpf: cpf
              }
            } 
            )
            res.send('Colaborador vai mudar a senha');
          } else {
            res.send('não');
          }
        } else {
          res.status(404).json({ error: 'Colaborador não encontrado' });
        }
      });
    } else {
      res.status(404).json({ error: 'Empresa não encontrada' });
    }
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar empresa' });
  });
});

router.post('/recuperarsenha', (req, res) => {
  var empresa = req.body.empresa
  var cpf = req.body.cpf
  var pergunta = ''
  
  let mensagemcolaborador = 'Verifique seus dados e tente novamente.';
  const encodedMsg = encodeURIComponent(mensagemcolaborador);
  

  Empresa.findOne({
    where: {
      identificacao: empresa
    }
  }).then(empresaEncontrada => {
    if (empresaEncontrada !== undefined) {

      Colaborador.findOne({
        where: {
          cpf: cpf,
          empresaId: empresaEncontrada.id,
        }
      }).then(colaborador => {
        if (colaborador !== null) {
          if ((colaborador.ativo === true)) {
       
            Pergunta.findOne ({
              where: {
                id: colaborador.pergunta
              }
            }).then ((p) =>{
              pergunta = p.descricao
              res.redirect(`/recuperando/passo2/${empresa}/${cpf}/${pergunta}`);
            })
            
            
         
          } 

          else {
            res.send('não');
          }
        } else {
          console.log('Colaborador não encontrado');
          res.redirect (`/recuperando/passo1?mensagemcolaborador=${encodedMsg}`)
          
        }
      });
    } else {
      console.log('Empresa não encontrada');
      res.redirect (`/recuperando/passo1?mensagemcolaborador=${encodedMsg}`)
    }
  }).catch(err => {
    console.log('Empresa não encontrada');
      res.redirect (`/recuperando/passo1?mensagemcolaborador=${encodedMsg}`)
  });


})

router.post ('/recuperandosenha2', (req, res) => {
  var empresa = req.body.empresa
  var cpf = req.body.cpf
  var pergunta = req.body.pergunta
  var resposta = req.body.resposta

  let mensagemcolaborador = 'Verifique seus dados e tente novamente.';
  const encodedMsg = encodeURIComponent(mensagemcolaborador);

  Colaborador.findOne ({
    where: {
      cpf: cpf
    }
  }).then ((colaborador) =>{
    if (colaborador.resposta == resposta) {
      res.redirect (`/recuperando/passo3/${empresa}/${cpf}/${pergunta}/${resposta}`)
    } else {
      console.log ('resposta errada')
      res.redirect(`/recuperando/passo2/${empresa}/${cpf}/${pergunta}?mensagemcolaborador=${encodedMsg}`)
     
    }
  }).catch (err => {
    res.send ('procure o servidor')
  })

  
})

router.post('/recuperarsenhasalvando', (req, res) => {
  var cpf = req.body.cpf;
  var novaSenha = req.body.senha;
  var empresa = req.body.empresa
  var pergunta = req.body.pergunta
  var resposta = req.body.resposta

  let msg = 'Senha alterada, efetue seu login!';
  const encodedMsg = encodeURIComponent(msg);


  const hash = bcrypt.hashSync(novaSenha, 10);

  Colaborador.findOne({
    where: {
      cpf: cpf
    }
  }).then((colaborador) => {
    if (colaborador) {
      // Atualiza a senha do colaborador
      colaborador.update({
        senha: hash
      }).then(() => {
        console.log('Senha atualizada com sucesso.');
        res.redirect (`/acesso?mensagem=${encodedMsg}`)
      }).catch((error) => {
        console.error('Erro ao atualizar senha:', error);
        res.status(500).send('Erro ao atualizar senha.');
      });
    } else {
      console.error('Colaborador não encontrado.');
      res.status(404).send('Colaborador não encontrado.');
    }
  }).catch((error) => {
    console.error('Erro ao buscar colaborador:', error);
    res.status(500).send('Erro ao buscar colaborador.');
  });
});





module.exports = router