export const DUNGEONS = {
  KOV: "King of Voracity raid (LV86) ",
  KOF: "King of Flies raid (LV85) ",
  KOO: "King of the Ocean raid (LV87) ",
  TIAMAT: "Tiamat (LV87) ",
  NM_TIAMAT = "[Nightmare] Tiamat (LV88) ",
  DR_TIAMAT = "Dragon Tiamat (LV87) ",
  NM_DR_TIAMAT = "[Nightmare] Dragon Tiamat (LV88) ",
  OVERFLOOD_L: "Overflood ",
  OVERFLOOD_S: "Overflood "
}

export const STATUS = {
  STARTING: "will open in 1 hour. Get Ready!",
  START: "has opened. The raid will remain open for the next 10 hours.",
  ENDING = "will end in 2 hours.",
  END: "has ended.",
  WILL_OPEN: "will open today in 12 hours.",
  DAY_START: "is open for today.",
  OVERFLOOD_L: "has opened. The dungeon will remain open for 1 hour.",
  OVERFLOOD_S: "has opened. The dungeon will remain open for 30 minutes."
}

export const IMAGES = {
  KOF: "\nhttps://imgur.com/PJVbqvz",
  KOV: "\nhttps://imgur.com/eVboHcQ",
  KOO: "\nhttps://media.discordapp.net/attachments/319463845552848907/743715872627097620/SCREEN_CAPTURE_2020-08-13_20-36-32-614.PNG?width=436&height=139"
}

export const OPEN_DAYS = {
  KOF: [2, 4, 6],
  KOV: [1, 3, 5, 0],
  KOO: [4, 6, 0]
}

export const CLOSE_DAYS = {
  KOF: [3, 5, 0],
  KOV: [2, 4, 6, 1],
  KOO: [5, 0, 1]
}

export const DURATION = {
  ONE_HOUR: 3600000,
  TWO_HOUR: 7200000,
  OVERFLOOD_L: 3600000,
  OVERFLOOD_S: 1800000
}

export const OPEN_HOURS = {
  OVERFLOOD_L: [10, 15, 18, 20, 23],
  OVERFLOOD_S: [0, 1]
}

export const OPEN_MIN = {
  OVERFLOOD_S: 30
}