require('dotenv').config()

const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost:27017/siph-mc-dev"
// console.log('mongodb_uri: ', mongodb_uri);
const mongodb_config = require('./mongodb.config.json')
require('./libs/MongoDBConnect')(mongodb_uri, mongodb_config)

const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const compression = require('compression')
const express = require('express')
const app = express()

// {useUnifiedTopology: true}

app.set('views', './views');
app.set('view engine', 'pug');

app.use(cors())
app.use(compression())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require('./libs/XDCSApp'))

app.use(require('./routes'))

app.use('/public', express.static(path.join('./public')))
app.use('/library/axios', express.static(path.join('./node_modules/axios/dist')))
app.use('/library/bootstrap', express.static(path.join('./node_modules/bootstrap/dist')))
app.use('/library/jquery', express.static(path.join('./node_modules/jquery/dist')))

const port = process.env.PORT || 8100
app.listen(port, () => {
  console.log(`Server started on port ${port}, env=${process.env.NODE_ENV}`)
})