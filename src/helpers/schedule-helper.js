const schedule = require("node-schedule-tz")

const createRule = ({ minute = 0, hour = 4, dayOfWeek }) => {
  const rule = new schedule.RecurrenceRule()
  rule.minute = minute
  rule.hour = hour
  rule.dayOfWeek = dayOfWeek
  return rule
}

module.exports = {
  createRule
}