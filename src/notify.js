const schedule = require("node-schedule-tz")
import { DUNGEONS, STATUS, IMAGES, OPEN_DAYS, CLOSE_DAYS } from './constants'
import RaidEntity from './entities/raid-entity'
import IntervalEntity from './entities/interval-entity'
import { createRule } from './helpers/common-helper'

const time_regex = /([0-9]+)((:|.)([0-9]+))*/
const time_delimit = /(:|.)/

// const YOD_SEA = "Yod Sea (LV86) "
// const SEA_IMG = "\nhttps://i.imgur.com/IOzsjaZ.png"
// const SEA_DAYS = [3, 6, 0]

function setupSchedule(channel) {
  let entities = []
  entities.push(new RaidEntity({ dungeon: 'KOF', channel }))
  entities.push(new RaidEntity({ dungeon: 'KOV', channel }))
  entities.push(new RaidEntity({ dungeon: 'KOO', channel }))
  entities.push(new DailyEntity({ dungeon: 'TIAMAT', channel }))
  entities.push(new DailyEntity({ dungeon: 'DR_TIAMAT', channel }))
  entities.push(new DailyEntity({ dungeon: 'NM_TIAMAT', channel }))
  entities.push(new DailyEntity({ dungeon: 'NM_DR_TIAMAT', channel }))
  entities.push(new IntervalEntity({ dungeon: 'OVERFLOOD_L', channel }))
  entities.push(new IntervalEntity({ dungeon: 'OVERFLOOD_S', channel }))

  entities.forEach(entity => {
    let messages = entity.messages
    messages.forEach(message => scheduleMessage(message))
  })

  clearMessages(channel)
}

function sendMessage(message) {
  message.channel.send(createMessage(message)).then(function (notif) {
    if (message.timeout) {
      notif.delete({ timeout: message.timeout })
    }
  })
  console.log(`Message sent: ${message.dungeon}${message.status}`)
  return true
}

function createMessage(message) {
  console.log(`Message created: ${message.dungeon}${message.status}`)
  return `${message.dungeon}${message.status}${message.img ? message.img : ""}`
}

function scheduleMessage(message) {
  let job = schedule.scheduleJob(message.rule, () => sendMessage(message))
  return job
}

function clearMessages(channel) {
  let cleanup_rule = createRule()

  schedule.scheduleJob(cleanup_rule, function () {
    channel
      .bulkDelete(20)
      .then((msg) => console.log(`Cleaned ${msg.size} messages`))
  })
}

function scheduleCustomNotify(channel, content, h, m) {
  let job = schedule.scheduleJob({ hour: h, minute: m }, function () {
    channel.send(content)
  })
  return job
}

//Public API
module.exports.scheduleMessage = scheduleMessage
module.exports.createMessage = createMessage
module.exports.setupSchedule = setupSchedule
