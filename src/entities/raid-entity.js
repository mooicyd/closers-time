const { DUNGEONS, OPEN_DAYS, STATUS, CLOSE_DAYS, DURATION, RAID_HOURS, IMAGES } = require('../constants')
const { createRule } = require('../helpers/schedule-helper')

class RaidEntity {
  constructor({ channel, dungeon }) {
    let raidMessages = []

    raidMessages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ hour: RAID_HOURS.STARTING, dayOfWeek: OPEN_DAYS[dungeon] }),
      status: STATUS.STARTING,
      timeout: DURATION.ONE_HOUR
    })
    raidMessages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ hour: RAID_HOURS.START, dayOfWeek: OPEN_DAYS[dungeon] }),
      status: STATUS.START,
      img: IMAGES[dungeon]
    })
    raidMessages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ hour: RAID_HOURS.ENDING, dayOfWeek: CLOSE_DAYS[dungeon] }),
      status: STATUS.ENDING,
      timeout: DURATION.TWO_HOUR,
      img: IMAGES[dungeon]
    })
    raidMessages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ hour: RAID_HOURS.END, dayOfWeek: CLOSE_DAYS[dungeon] }),
      status: STATUS.END
    })
    raidMessages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ minute: 1, dayOfWeek: OPEN_DAYS[dungeon] }),
      status: STATUS.WILL_OPEN,
      img: IMAGES[dungeon]
    })

    this.raidMessages = raidMessages
  }

  get messages() {
    return this.raidMessages
  }
}

module.exports = { RaidEntity }