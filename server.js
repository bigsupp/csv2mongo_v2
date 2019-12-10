require('dotenv').config()
require('./libs/MongoDBConnect')()

const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const baseURL = 'http://localhost:8000/api'

const modelTargets = fs.readdirSync(path.join(__dirname, 'modelTargets'))
modelTargets.map(modelTarget => {
  require('./modelTargets/' + modelTarget)
})

app.get('/', (req, res) => {
  res.render('home', {
    baseURL
  })
})
app.get('/:model', (req, res) => {
  const target_model = req.params.model
  try {
    res.render('upload', {
      baseURL,
      target_model
    })
  } catch (error) {
    res.send(`Error target model is not found, <a href="/">back to home.</a>`)
  }
})

app.use('/public', express.static(path.join('./public')))
app.use('/library/axios', express.static(path.join('./node_modules/axios/dist')))
app.use('/library/bootstrap', express.static(path.join('./node_modules/bootstrap/dist')))
app.use('/library/jquery', express.static(path.join('./node_modules/jquery/dist')))

app.use('/api', require('./routes'))

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}, env=${process.env.NODE_ENV}`)
})