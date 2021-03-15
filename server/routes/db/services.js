const express = require('express')
const Router = express.Router()
const controller = require('../../controller/dbcontroller')

Router.get('/', (req, res) => {
  res.send({ methods: ['/saveSchedule', '/schedules'] })
})

Router.post('/saveSchedule', controller.saveSchedule)

Router.get('/schedules', controller.getSchedules)

Router.put('/updateSchedule', controller.updateSchedule)

Router.post('/deleteSchedule', controller.deleteSchedule)

module.exports = Router
