const express = require ('express')
const app = express();
const bodyParser = require ('body-parser')
const session = require ('express-session')
const connection = require ('./database/database')

//Routes
const BasicoRoutes = require ('./routes/BasicoRoutes')

//Controllers
const ClientesControllers = require ('./controllers/ClientesControllers')
const ColaboradoresControllers = require ('./controllers/ColaboradoresControllers')
const OrcamentosControllers = require ('./controllers/OrcamentosControllers')
const MarcasControllers = require ('./controllers/MarcasControllers')
const ModelosControllers = require ('./controllers/ModelosControllers')
const AmbientesControllers = require ('./controllers/AmbientesControllers')
const PrestacoesControllers = require ('./controllers/PrestacoesControllers')
const OrigensControllers = require ('./controllers/OrigensControllers')
const BtusControllers = require ('./controllers/BtusControllers')
const PagamentosControllers = require ('./controllers/PagamentosControllers')
const LoginsControllers = require ('./controllers/LoginsControllers')
const RecebimentosControllers = require ('./controllers/RecebimentosControllers')

//Models
const Empresa = require ('./models/Empresa')
const Permissao = require ('./models/Permissao')
const Btu = require ('./models/Btu')
const Pagamento = require ('./models/Pagamento')
const Ambiente = require ('./models/Ambiente')
const Prestacao = require ('./models/Prestacao')
const Origem = require ('./models/Origem')
const Marca = require ('./models/Marca')
const Modelo = require ('./models/Modelo')
const Colaborador = require ('./models/Colaborador')
const Endereco = require ('./models/Endereco')
const Cliente = require ('./models/Cliente')
const Orcamento = require ('./models/Orcamento')
const Agenda = require ('./models/Agenda')
const Recebimento = require ('./models/Recebimento')






//Sessions
app.use(session({
  secret: 'sua_chave_secreta_aqui', // Troque por uma chave segura
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Em produção, defina como true se estiver usando HTTPS
    maxAge: 30 * 60 * 1000 // 30 minutos em milissegundos
  }
}));


//View engine
app.set('view engine', 'ejs')

//Static
app.use(express.static('public'))

//Body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Database
connection
  .authenticate()
  .then(() => {
    console.log ('Conexão com o banco, ok')
  }).catch  ((err) => {
    console.log('Erro ao conectar com o banco: ' + err)
})

app.use('/', BasicoRoutes)

app.use('/', ClientesControllers)
app.use('/', ColaboradoresControllers)
app.use('/', OrcamentosControllers)
app.use('/', MarcasControllers)
app.use('/', ModelosControllers)
app.use('/', AmbientesControllers)
app.use('/', PrestacoesControllers)
app.use('/', OrcamentosControllers)
app.use('/', OrigensControllers)
app.use('/', BtusControllers)
app.use('/', PagamentosControllers)
app.use('/', RecebimentosControllers)
app.use('/', LoginsControllers)

app.get ('/', (req, res) => {
  res.render('informacao/index')
})

app.listen(8080, () => {
  console.log ('Servidor Rodando!')
})