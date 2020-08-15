const { DUNGEONS, OPEN_DAYS, STATUS, IMAGES } = require('../constants')
const { createRule } = require('../helpers/schedule-helper')

class DailyEntity {
  constructor({ channel, dungeon }) {
    let dailyMessages = []

    dailyMessages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ minute: 1, dayOfWeek: OPEN_DAYS[dungeon] }),
      status: STATUS.DAY_START,
      img: IMAGES[dungeon]
    })

    this.dailyMessages = dailyMessages
  }

  get messages() {
    return this.dailyMessages
  }
}

module.exports = { DailyEntity }