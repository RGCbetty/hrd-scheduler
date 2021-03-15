const express = require('express')
const router = express.Router()
const controller = require('../../controller/authcontroller')
// router.use('/dtx', require('./routes/dtx'))
// router.use(config.api.dxf, require('./routes/dxf'))
// router.use('/csv', require('./routes/csv'))
// router.use('/download', require('./routes/download'));
// router.use('/xls', require('./routes/xls'))
// router.use('/db', require('./db'))
// router.use('/auth', require('./auth'))

router.get('/', (req, res) => {
  res.send({ url: ['/login', '/validate'] })
})

//http://10.169.141.101:6080/api?empCode=38610
router.post('/login', controller.login)

router.get('/validate', controller.validate)

router.get('/selection/companies', (req, res) => {
  let sql = `Select AbbreviationName as text, CompanyCode as value from Companies where DeletedDate is Null`
  HRDgroup.raw(sql)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      console.log(err)
    })
})

//http://10.169.141.101:6080/api/selection/departments?CompanyCode=003
router.get('/selection/departments', (req, res) => {
  let sql = `Select DepartmentName as text, DepartmentCode as value from Departments where DeletedDate is Null
  and CompanyCode = '${req.query.CompanyCode}'`
  HRDgroup.raw(sql)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      console.log(err)
    })
})

//Sample API http://10.169.141.101:6080/api/selection/sections?CompanyCode=003&DepartmentCode=123
router.get('/selection/sections', (req, res) => {
  let sql = `SELECT D.SectionName AS text, A.SectionCode AS value FROM DepartmentSectionRelations A
  LEFT JOIN Companies B ON B.CompanyCode = A.CompanyCode
  LEFT JOIN Departments C ON C.CompanyCode = A.CompanyCode AND C.DepartmentCode = A.DepartmentCode
  LEFT JOIN Sections D ON D.CompanyCode= A.CompanyCode AND D.SectionCode = A.SectionCode
  WHERE A.CompanyCode='${req.query.CompanyCode}'
  AND A.DepartmentCode='${req.query.DepartmentCode}'
  AND A.DeletedDate IS NULL AND D.DeletedDate is NULL`
  HRDgroup.raw(sql)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      console.log(err)
    })
})

// SAMPLE API http://10.169.141.101:6080/api/selection/employees?CompanyCode=003&DepartmentCode=123&SectionCode=00451
router.get('/selection/employees', (req, res) => {
  let sql = `SELECT A.EmployeeName AS text, A.EmployeeCode AS value FROM Employees A
LEFT JOIN Companies B ON A.CompanyCode = B.CompanyCode
LEFT JOIN DepartmentSectionRelations C ON A.CompanyCode = C.CompanyCode AND C.DepartmentCode= A.DepartmentCode AND A.SectionCode =C.SectionCode
WHERE A.CompanyCode = '${req.query.CompanyCode}' AND A.DepartmentCode ='${req.query.DepartmentCode}' AND A.SectionCode='${req.query.SectionCode}'
AND A.RetiredDate IS NULL`
  HRDgroup.raw(sql)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = router
