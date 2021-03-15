const { Scheduler } = require('../config/couchdb')

exports.saveSchedule = async (req, res, next) => {
  try {
    await Scheduler.insert(req.body)
    return res.status(200).send({ message: 'success' })
  } catch (err) {
    // return res.status(500).send({ message: err.message })
    next(err)
  }
}

exports.deleteSchedule = async (req, res, next) => {
  try {
    await Scheduler.destroy(req.body._id, req.body._rev)
    return res.send('Event Deleted!')
  } catch (err) {
    // return res.status(500).send({ message: err.message })
    next(err)
  }
}
exports.updateSchedule = async (req, res, next) => {
  try {
    // Scheduler.insert(req.body, (err, res) => {
    //   if (err) {
    //     return console.log('failed to update')
    //   }
    //   let item = {
    //     _id: req.body._id,
    //     _rev: res.rev,
    //     start: req.body.start,
    //     selectedDepartment: req.body.selectedDepartment,
    //     selectedSection: req.body.selectedSection,
    //     venue: req.body.venue,
    //     color: req.body.color,
    //     selectedName: req.body.selectedName,
    //     sectionColor: req.body.sectionColor,
    //     name: req.body.name,
    //     info: req.body.info,
    //     timeFrom: req.body.timeFrom,
    //     timeTo: req.body.timeTo,
    //     reservedBy: req.body.reservedBy,
    //     employee_code: req.body.employee_code,
    //     requestingName: req.body.requestingName,
    //     colorSection: req.body.colorSection,
    //   }
    //   Scheduler.insert(item, (err, res) => {
    //     if (!err) {
    //       res.send('Successfully Updated')
    //     } else {
    //       res.send('Update Failed')
    //     }
    //   })
    // })
    await Scheduler.insert(req.body)
  } catch (err) {
    next(err)
  }
}

exports.getSchedules = async (req, res, next) => {
  try {
    let body = await Scheduler.view('Scheduler', 'Date', {
      include_docs: true,
    })
    let result = body.rows.map((item) => {
      return item.doc
    })
    console.log(result)
    res.send(result)
  } catch (err) {
    next(err)
  }
}
