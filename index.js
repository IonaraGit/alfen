const express = require ('express')
const app = express();
const bodyParser = require ('body-parser')
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

//Models
const Cliente = require ('./models/Cliente')
const Colaborador = require ('./models/Colaborador')
const Endereco = require ('./models/Endereco')
const Orcamento = require ('./models/Orcamento')
const Origem = require ('./models/Origem')
const Marca = require ('./models/Marca')
const Modelo = require ('./models/Modelo')
const Prestacao = require ('./models/Prestacao')
const Ambiente = require ('./models/Ambiente')
const Btu = require ('./models/Btu')

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

app.get ('/', (req, res) => {
  res.render('informacao/index')
})


app.listen(8080, () => {
  console.log ('Servidor Rodando!')
})