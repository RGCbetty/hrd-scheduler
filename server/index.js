const express = require('express')
const app = express()
require('dotenv').config()

app.use(require('cors')())
// app.use

const helmet = require('helmet')
app.use(helmet())

app.use('/api', require('./routes'))

// initialize uuid key
process.env.SECRET_KEY = require('crypto')
  .randomBytes(64)
  .toString('hex')

const router = express.Router()
app.use(express.static(`${__dirname}/client`))

router.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/client/index.html`)
})

app.use('/', router)

const config = require('./config')
app.listen(config.port, () => {
  console.log(`listening to the port ${config.port}`)
})
