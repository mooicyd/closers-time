const schedule = require("node-schedule-tz")
import { DUNGEONS, STATUS, IMAGES, OPEN_DAYS, CLOSE_DAYS } from './constants'

const time_regex = /([0-9]+)((:|.)([0-9]+))*/
const time_delimit = /(:|.)/

const RAID_STARTING_H = 15
const RAID_START_H = 16
const RAID_ENDING_H = 0
const RAID_END_H = 2
const ONE_HOUR = 3600000
const TWO_HOUR = 7200000
const THIRTY_MIN = 1800000
const FIVE_MIN = 300000
const HALF_HOUR = 30

const OVERFLOOD = "Overflood "
const OF_L_START = "has opened. The dungeon will remain open for 1 hour."
const OF_S_START = "has opened. The dungeon will remain open for 30 minutes."
const OF_L_TIMES = [10, 15, 18, 20, 23]
const OF_S_TIMES = [0, 1]
const OF_IMG = "\nhttps://imgur.com/DrfvjPv"

// const YOD_SEA = "Yod Sea (LV86) "
// const SEA_IMG = "\nhttps://i.imgur.com/IOzsjaZ.png"
// const SEA_DAYS = [3, 6, 0]

const TIAMAT_DAYS = [1, 6]
const NM_TIAMAT_DAYS = [5, 0]
const DR_TIAMAT_DAYS = [2, 0]
const NM_DR_TIAMAT_DAYS = [3, 6]

function setupSchedule(channel) {
  scheduleRaidNotification({ raid: 'KOF', channel })
  scheduleRaidNotification({ raid: 'KOV', channel })
  scheduleRaidNotification({ raid: 'KOO', channel })

  //Overflood timers
  let ofLong = setupRules({
    hours: OF_L_TIMES,
  })

  ofLong.forEach(function (rule) {
    let messageObj = {
      channel: channel,
      dungeon: OVERFLOOD,
      rule: rule,
      status: OF_L_START,
      timeout: ONE_HOUR,
      img: OF_IMG,
    }
    scheduleMessage(messageObj)
  })

  let ofShort = setupRules({
    hours: OF_S_TIMES,
    min: HALF_HOUR,
  })

  ofShort.forEach(function (rule) {
    let messageObj = {
      channel: channel,
      dungeon: OVERFLOOD,
      rule: rule,
      status: OF_S_START,
      timeout: THIRTY_MIN,
      img: OF_IMG,
    }
    scheduleMessage(messageObj)
  })

  clearMessages(channel)

  //Yod Sea
  // let sea_rule = new schedule.RecurrenceRule()
  // sea_rule.minute = 1
  // sea_rule.hour = 4
  // sea_rule.dayOfWeek = SEA_DAYS
  // let sea_days = {
  //   channel: raidchannel,
  //   dungeon: YOD_SEA,
  //   rule: sea_rule,
  //   status: STATUS['DAY_START'],
  //   img: SEA_IMG,
  // }
  // scheduleMessage(sea_days)

  //Tiamat Day
  // let tiamat_day_rule = createRule({ minute: 1, dayOfWeek: TIAMAT_DAYS })
  let tiamat_days = {
    channel: channel,
    dungeon: DUNGEONS['TIAMAT'],
    rule: createRule({ minute: 1, dayOfWeek: TIAMAT_DAYS }),
    status: STATUS['DAY_START'],
    img: "",
  }
  scheduleMessage(tiamat_days)

  //Nightmare Tiamat Day
  // let nm_tiamat_day_rule = createRule({ minute: 1, dayOfWeek: NM_TIAMAT_DAYS })
  let nm_tiamat_days = {
    channel: channel,
    dungeon: DUNGEONS['NM_TIAMAT'],
    rule: createRule({ minute: 1, dayOfWeek: NM_TIAMAT_DAYS }),
    status: STATUS['DAY_START'],
    img: "",
  }
  scheduleMessage(nm_tiamat_days)

  //Dragon Tiamat Day
  // let dr_tiamat_day_rule = createRule({ minute: 1, dayOfWeek: DR_TIAMAT_DAYS })
  let dr_tiamat_days = {
    channel: channel,
    dungeon: DUNGEONS['DR_TIAMAT'],
    rule: createRule({ minute: 1, dayOfWeek: DR_TIAMAT_DAYS }),
    status: STATUS['DAY_START'],
    img: "",
  }
  scheduleMessage(dr_tiamat_days)

  //Nightmare Dragon Tiamat Day
  // let nm_dr_tiamat_day_rule = createRule({ minute: 1, dayOfWeek: NM_DR_TIAMAT_DAYS })
  let nm_dr_tiamat_days = {
    channel: channel,
    dungeon: DUNGEONS['NM_DR_TIAMAT'],
    rule: createRule({ minute: 1, dayOfWeek: NM_DR_TIAMAT_DAYS }),
    status: STATUS['DAY_START'],
    img: "",
  }
  scheduleMessage(nm_dr_tiamat_days)
}

function createRule({ minute = 0, hour = 4, dayOfWeek }) {
  const rule = new schedule.RecurrenceRule()
  rule.minute = minute
  rule.hour = hour
  rule.dayOfWeek = dayOfWeek
  return rule
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

function setupRules(obj) {
  let rules = new Array()
  obj.hours.forEach(function (hour) {
    let rule = createRule({ hour, minute: obj.min })
    rules.push(rule)
  })
  return rules
}

function scheduleRaidNotification({ dungeon, channel }) {
  let starting = {
    channel: channel,
    dungeon: DUNGEONS[dungeon],
    rule: createRule({ hour: RAID_STARTING_H, dayOfWeek: OPEN_DAYS[dungeon] }),
    status: STATUS.STARTING,
    timeout: ONE_HOUR,
  }
  let start = {
    channel: channel,
    dungeon: DUNGEONS[dungeon],
    rule: createRule({ hour: RAID_START_H, dayOfWeek: OPEN_DAYS[dungeon] }),
    status: STATUS.START,
    img: IMAGES[dungeon],
  }
  let ending = {
    channel: channel,
    dungeon: DUNGEONS[dungeon],
    rule: createRule({ hour: RAID_ENDING_H, dayOfWeek: CLOSE_DAYS[dungeon] }),
    status: STATUS.ENDING,
    timeout: TWO_HOUR,
    img: IMAGES[dungeon],
  }
  let end = {
    channel: channel,
    dungeon: DUNGEONS[dungeon],
    rule: createRule({ hour: RAID_END_H, dayOfWeek: CLOSE_DAYS[dungeon] }),
    status: STATUS.END,
  }
  let willOpen = {
    channel: channel,
    dungeon: DUNGEONS[dungeon],
    rule: createRule({ minute: 1, dayOfWeek: OPEN_DAYS[dungeon] }),
    status: STATUS.WILL_OPEN,
    img: IMAGES[dungeon],
  }
  // scheduleMessage([willOpen, starting, start, ending, end])

}

function clearMessages(channel) {
  let cleanup_rule = createRule()

  let cleanup = schedule.scheduleJob(cleanup_rule, function () {
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
module.exports.setupRules = setupRules
module.exports.scheduleMessage = scheduleMessage
module.exports.createMessage = createMessage
module.exports.setupSchedule = setupSchedule
