const express = require('express')
const router = express.Router()
const mssql = require('mssql')

router.use(require('cors')())
router.use(express.json({ limit: '50mb' }))
router.use(express.urlencoded({ limit: '50mb', extended: false }))

var HRDgroup = require('knex')({
  client: 'mssql',
  connection: {
    host: 'hrdsql',
    user: 'sa',
    password: '81at84',
    database: 'GroupCompanyInformation',
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
// router.use('/dtx', require('./routes/dtx'))
// router.use(config.api.dxf, require('./routes/dxf'))
// router.use('/csv', require('./routes/csv'))
// router.use('/download', require('./routes/download'));
// router.use('/xls', require('./routes/xls'))
// router.use('/db', require('./db'))
router.use('/auth', require('./auth'))
router.use('/db', require('./db/services'))

router.get('/', (req, res) => {
  res.send({ url: ['/auth', '/db'] })
})

//  http://10.169.141.101:6080/api/login?empCode=38610
router.get('/login', (req, res) => {
  // res.send({ url: ['db'] })
  let sql = `SELECT * FROM Employees
  WHERE EmployeeCode = '${req.query.empCode}' AND RetiredDate IS NULL`
  HRDgroup.raw(sql)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})
// http://10.169.141.101:6080/api/companies
router.get('/companies', (req, res) => {
  let sql = `Select AbbreviationName as text, CompanyCode as value FROM Companies
  WHERE DeletedDate IS NULL
  AND CoopCode IS null
  AND SortNo IN (1,2,3,4,5)`
  HRDgroup.raw(sql)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})

//Sample API http://10.169.141.101:6080/api/departments?CompanyCode=003
router.get('/departments', (req, res) => {
  //
  let sql = `Select DepartmentName as text, DepartmentCode as value from Departments where  CompanyCode = '${req.query.CompanyCode}' and DeletedDate is Null`
  HRDgroup.raw(sql)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})

//Sample API http://10.169.141.101:6080/api/sections?CompanyCode=003&DepartmentCode=123
router.get('/sections', (req, res) => {
  let sql = `SELECT D.SectionName AS text, A.SectionCode AS value FROM DepartmentSectionRelations A
  LEFT JOIN Companies B ON B.CompanyCode = A.CompanyCode
  LEFT JOIN Departments C ON C.CompanyCode = A.CompanyCode AND C.DepartmentCode = A.DepartmentCode
  LEFT JOIN Sections D ON D.CompanyCode= A.CompanyCode AND D.SectionCode = A.SectionCode
  WHERE A.CompanyCode='${req.query.CompanyCode}'
  AND A.DepartmentCode='${req.query.DepartmentCode}'
  AND A.DeletedDate IS NULL AND D.DeletedDate is NULL`
  HRDgroup.raw(sql)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})

// SAMPLE API http://10.169.141.101:6080/api/employees?CompanyCode=003&DepartmentCode=123&SectionCode=00451
router.get('/employees', (req, res) => {
  let sql = ''
  if (req.query.SectionCode) {
    sql = `SELECT A.EmployeeName AS text, A.EmployeeCode AS value FROM Employees A
LEFT JOIN Companies B ON A.CompanyCode = B.CompanyCode
LEFT JOIN DepartmentSectionRelations C ON A.CompanyCode = C.CompanyCode AND C.DepartmentCode= A.DepartmentCode AND A.SectionCode =C.SectionCode
WHERE A.CompanyCode = '${req.query.CompanyCode}' AND A.DepartmentCode ='${req.query.DepartmentCode}' AND A.SectionCode='${req.query.SectionCode}'
AND A.RetiredDate IS NULL`
  } else {
    sql = `SELECT A.EmployeeName AS text, A.EmployeeCode AS value FROM Employees A
LEFT JOIN Companies B ON A.CompanyCode = B.CompanyCode
LEFT JOIN DepartmentSectionRelations C ON A.CompanyCode = C.CompanyCode AND C.DepartmentCode= A.DepartmentCode AND A.SectionCode =C.SectionCode
WHERE A.CompanyCode = '${req.query.CompanyCode}' AND A.DepartmentCode ='${req.query.DepartmentCode}' AND A.RetiredDate IS NULL`
  }
  HRDgroup.raw(sql)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router
