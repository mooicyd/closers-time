import { DUNGEONS, OPEN_DAYS, STATUS, OPEN_HOURS, OPEN_MIN, DURATION } from '../constants'
import { createRule } from '../helpers/common-helper'

export default class IntervalEntity {
  constructor({ channel, dungeon }) {
    let messages = []
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
      messages.push(message)
    })

    this.messages = messages
  }

  get messages() {
    return this.messages
  }
}