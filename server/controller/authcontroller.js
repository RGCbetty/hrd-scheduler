const jwt = require('jsonwebtoken')
require('dotenv').config()
const HRDgroup = require('knex')({
  client: 'mssql',
  connection: {
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASS}`,
    database: `${process.env.DB_NAME}`,
    connectionTimeout: 300000,
    requestTimeout: 300000,
    pool: {
      idleTimeoutMillis: 300000,
      max: 100,
    },
    options: {
      encrypt: false,
      enableArithAbort: false,
    },
  },
})

exports.login = async (req, res) => {
  try {
    let sql = `SELECT * FROM Employees
    WHERE EmployeeCode = '${req.query.empCode}' AND RetiredDate IS NULL`
    let authUser = await HRDgroup.raw(sql)
    console.log(authUser[0])
    console.log(req.body)
    let passwordIsValid =
      authUser[0].EmployeeCode == req.body.password ? true : false
    console.log('testst', passwordIsValid)
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      })
    }
    let token = jwt.sign(
      { id: authUser[0].EmployeeCode },
      process.env.SECRET_KEY,
      {
        expiresIn: 86400, // 12 hours
      },
    )
    // let decode = jwt_decode(token)
    return res.status(200).send({
      user: authUser[0],
      accessToken: token,
    })
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

exports.validate = (req, res, next) => {
  const token = req.get('x-access-token')
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Authentification Failed',
      })
    }
  })
  next()
}
