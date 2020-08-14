import { DUNGEONS, OPEN_DAYS, STATUS } from '../constants'

export default class DailyEntity {
  constructor({ channel, dungeon }) {
    let messages = []

    messages.push({
      channel: channel,
      dungeon: DUNGEONS[dungeon],
      rule: createRule({ minute: 1, dayOfWeek: OPEN_DAYS[dungeon] }),
      status: STATUS.DAY_START,
      img: IMAGES[dungeon]
    })

    this.messages = messages
  }

  get messages() {
    return this.messages
  }
}