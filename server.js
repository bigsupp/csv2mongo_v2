require('dotenv').config()

const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost:27017/siph-mc-dev"
// console.log('mongodb_uri: ', mongodb_uri);
const mongodb_config = require('./mongodb.config.json')
require('./libs/MongoDBConnect')(mongodb_uri, mongodb_config)

const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const express = require('express')
const app = express()

// {useUnifiedTopology: true}

app.set('views', './views');
app.set('view engine', 'pug');

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const baseURL = process.env.API_BASEURL || 'http://localhost:8100/api'

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

const port = process.env.PORT || 8100
app.listen(port, () => {
  console.log(`Server started on port ${port}, env=${process.env.NODE_ENV}`)
})