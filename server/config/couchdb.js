const HRDapps59 = require('nano')('http://hrdapps59:5984')

const Scheduler = HRDapps59.db.use('hrd_group_scheduler')
// const masterList = nanoHRdApps48.db.use('hrd_masteruser')
// const delphiLisense = nanoLocalHost.db.use('delphi_license')

module.exports = {
  Scheduler,
}
