import { DUNGEONS, OPEN_DAYS, STATUS, CLOSE_DAYS, DURATION } from '../constants'

export default class RaidEntity {
  constructor({ channel, dungeon }) {
    let messages = []

    messages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ hour: RAID_STARTING_H, dayOfWeek: OPEN_DAYS[dungeon] }),
      status: STATUS.STARTING,
      timeout: DURATION.ONE_HOUR
    })
    messages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ hour: RAID_START_H, dayOfWeek: OPEN_DAYS[dungeon] }),
      status: STATUS.START,
      img: IMAGES[dungeon]
    })
    messages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ hour: RAID_ENDING_H, dayOfWeek: CLOSE_DAYS[dungeon] }),
      status: STATUS.ENDING,
      timeout: DURATION.TWO_HOUR,
      img: IMAGES[dungeon]
    })
    messages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ hour: RAID_END_H, dayOfWeek: CLOSE_DAYS[dungeon] }),
      status: STATUS.END
    })
    messages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ minute: 1, dayOfWeek: OPEN_DAYS[dungeon] }),
      status: STATUS.WILL_OPEN,
      img: IMAGES[dungeon]
    })

    this.messages = messages
  }

  get messages() {
    return this.messages
  }
}