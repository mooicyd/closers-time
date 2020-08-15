const { DUNGEONS, OPEN_DAYS, STATUS, OPEN_HOURS, DURATION, OPEN_MIN, IMAGES } = require('../constants')
const { createRule } = require('../helpers/schedule-helper')

class IntervalEntity {
  constructor({ channel, dungeon }) {
    let intervalMessages = []
    let openTimings = OPEN_HOURS[dungeon]

    openTimings.forEach(timing => {
      let message = {
        channel: channel,
        dungeon: DUNGEONS[dungeon],
        rule: createRule({ hour: timing, minute: OPEN_MIN[dungeon], dayOfWeek: OPEN_DAYS[dungeon] }),
        status: STATUS[dungeon],
        timeout: DURATION[dungeon],
        img: IMAGES[dungeon]
      }
      intervalMessages.push(message)
    })

    this.intervalMessages = intervalMessages
  }

  get messages() {
    return this.intervalMessages
  }
}

module.exports = { IntervalEntity }