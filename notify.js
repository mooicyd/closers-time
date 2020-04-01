const schedule = require('node-schedule-tz');
const v8 = require('v8');

const time_regex = /([0-9]+)((:|.)([0-9]+))*/
const time_delimit = /(:|.)/

const RAID_STARTING_H = 15; const RAID_START_H = 16; const RAID_ENDING_H = 0; const RAID_END_H = 2;
const ONE_HOUR = 3600000; const TWO_HOUR = 7200000; const THIRTY_MIN = 1800000; const FIVE_MIN = 300000; const HALF_HOUR = 30;
const KOV_DAYS = [0,2,4,6]; const KOF_DAYS = [1,3,5,0]; const NO_KOF_DAYS = [1,2,4,6]; const NO_KOV_DAYS = [1,3,5,0];
const KOV_RAID = "King of Voracity raid (LV87) "; const KOF_RAID = "King of Flies raid (LV85) ";
const RAID_STARTING = "will open in 1 hour. Get Ready!"; const RAID_START = "has opened. The raid will remain open for the next 10 hours.";
const RAID_ENDING = "will end in 2 hours."; const RAID_END = "has ended."; const WILL_OPEN = "will open today in 12 hours."
const KOF_IMG = "\nhttps://imgur.com/PJVbqvz"; const KOV_IMG = "\nhttps://imgur.com/eVboHcQ";

const OVERFLOOD = "Overflood ";
const OF_L_START = "has opened. The dungeon will remain open for 1 hour."; const OF_S_START = "has opened. The dungeon will remain open for 30 minutes.";
const OF_L_TIMES = [10, 15, 18, 20, 23]; const OF_S_TIMES = [0, 1];
const OF_IMG = "\nhttps://imgur.com/DrfvjPv";

const YOD_SEA = "Yod Sea (LV86) ";
const SEA_START = "is open for today.";
const SEA_IMG = "\nhttps://i.imgur.com/IOzsjaZ.png";
const SEA_DAYS = [3,6,0];

function setupSchedule(raidchannel) {
    let kovStartingRule = new schedule.RecurrenceRule();
    kovStartingRule.minute = 0;
    kovStartingRule.hour = RAID_STARTING_H;
    kovStartingRule.dayOfWeek = KOV_DAYS;

    let kovStartRule = copy(kovStartingRule);
    kovStartRule.hour = RAID_START_H;

    let kovEndingRule = copy(kovStartRule);
    kovEndingRule.hour = RAID_ENDING_H;
    kovEndingRule.dayOfWeek = NO_KOV_DAYS;

    let kovEndRule = copy(kovEndingRule);
    kovEndRule.hour = RAID_END_H;

    //King of Flies Timers
    let kofStartingRule = copy(kovStartingRule);
    kofStartingRule.dayOfWeek = KOF_DAYS;

    let kofStartRule = copy(kofStartingRule);
    kofStartRule.hour = RAID_START_H;

    let kofEndingRule = copy(kofStartRule);
    kofEndingRule.hour = RAID_ENDING_H;
    kofEndingRule.dayOfWeek = NO_KOF_DAYS;

    let kofEndRule = copy(kofEndingRule);
    kofEndRule.hour = RAID_END_H;

    //Overflood timers
    let ofLong = setupRules({hours: OF_L_TIMES});

    ofLong.forEach(function(rule) {
        let messageObj = { channel: raidchannel, dungeon: OVERFLOOD, rule: rule, status: OF_L_START, timeout: ONE_HOUR, img: OF_IMG};
        scheduleMessage(messageObj);
    })

    let ofShort = setupRules({hours: OF_S_TIMES, min: HALF_HOUR});

    ofShort.forEach(function(rule) {
        let messageObj = { channel: raidchannel, dungeon: OVERFLOOD, rule: rule, status: OF_S_START, timeout: THIRTY_MIN, img: OF_IMG};
        scheduleMessage(messageObj);
    })

    //King of Voracity
    let kov_starting = { channel: raidchannel, dungeon: KOV_RAID, rule: kovStartingRule, status: RAID_STARTING, timeout: ONE_HOUR};
    let kov_start = { channel: raidchannel, dungeon: KOV_RAID, rule: kovStartRule, status: RAID_START, img: KOV_IMG};
    let kov_ending = { channel: raidchannel, dungeon: KOV_RAID, rule: kovEndingRule, status: RAID_ENDING, timeout: TWO_HOUR, img: KOV_IMG};
    let kov_end = { channel: raidchannel, dungeon: KOV_RAID, rule: kovEndRule, status: RAID_END};

    scheduleMessage(kov_starting);
    scheduleMessage(kov_start);
    scheduleMessage(kov_ending);
    scheduleMessage(kov_end);

    //King of Flies
    let kof_starting = { channel: raidchannel, dungeon: KOF_RAID, rule: kofStartingRule, status: RAID_STARTING, timeout: ONE_HOUR};
    let kof_start = { channel: raidchannel, dungeon: KOF_RAID, rule: kofStartRule, status: RAID_START, img: KOF_IMG};
    let kof_ending = { channel: raidchannel, dungeon: KOF_RAID, rule: kofEndingRule, status: RAID_ENDING, timeout: TWO_HOUR, img: KOF_IMG};
    let kof_end = { channel: raidchannel, dungeon: KOF_RAID, rule: kofEndRule, status: RAID_END};

    scheduleMessage(kof_starting);
    scheduleMessage(kof_start);
    scheduleMessage(kof_ending);
    scheduleMessage(kof_end);

    clearMessages(raidchannel);

    //Yod Sea
    let sea_rule = new schedule.RecurrenceRule();
    sea_rule.minute = 1;
    sea_rule.hour = 4;
    sea_rule.dayOfWeek = SEA_DAYS;
    let sea_days = { channel: raidchannel, dungeon: YOD_SEA, rule: sea_rule, status: SEA_START, img: SEA_IMG}
    scheduleMessage(sea_days);

    //KoF day
    let kof_day_rule = new schedule.RecurrenceRule();
    kof_day_rule.minute = 1;
    kof_day_rule.hour = 4;
    kof_day_rule.dayOfWeek = KOF_DAYS;
    let kof_days = { channel: raidchannel, dungeon: KOF_RAID, rule: kof_day_rule, status: WILL_OPEN, img: KOF_IMG};
    scheduleMessage(kof_days);

    //KoV day
    let kov_day_rule = new schedule.RecurrenceRule();
    kov_day_rule.minute = 1;
    kov_day_rule.hour = 4;
    kov_day_rule.dayOfWeek = KOV_DAYS;
    let kov_days = { channel: raidchannel, dungeon: KOV_RAID, rule: kov_day_rule, status: WILL_OPEN, img: KOV_IMG};
    scheduleMessage(kov_days);
}

function copy(obj) {
    return v8.deserialize(v8.serialize(obj));
}

function sendMessage(message) {
    message.channel.send(createMessage(message)).then(function(notif) {
        if(message.timeout) {
            notif.delete(message.timeout);
        }
    });
    console.log(`Message sent: ${message.dungeon}${message.status}`);
    return true;
}

function createMessage(message) {
    console.log(`Message created: ${message.dungeon}${message.status}`);
    return `${message.dungeon}${message.status}${(message.img?message.img:"")}`
}

function scheduleMessage(message) {
    let job = schedule.scheduleJob(message.rule, () => sendMessage(message))
    return job;
}

function setupRules(obj) {
    let rules = new Array();
    obj.hours.forEach(function(hour) {
        let rule = new schedule.RecurrenceRule();
        rule.minute = ((obj.min)? obj.min: 0);
        rule.hour = hour;
        rules.push(rule);
    });
    return rules;
}

function clearMessages(channel) {
    let cleanup_rule = new schedule.RecurrenceRule();
    cleanup_rule.minute = 0;
    cleanup_rule.hour = 4;

    let cleanup = schedule.scheduleJob(cleanup_rule, function() {
      channel.bulkDelete(10).then(msg => console.log(`Cleaned ${msg.size} messages`));
  });
}

function scheduleCustomNotify(channel, content, h, m) {
    let job = schedule.scheduleJob({hour: h, minute: m}, function () {
        channel.send(content);
    })
    return job;
}

//Public API
module.exports.setupRules = setupRules;
module.exports.scheduleMessage = scheduleMessage;
module.exports.createMessage = createMessage;
module.exports.setupSchedule = setupSchedule;


//Custom Notification
// client.on('message', function(message) {
//
//     if(message.channel.id === process.env.READ_CHANNEL_ID
//         && message.member.roles.has(process.env.ROLE_ID)
//         && message.content.startsWith("<@!" + client.user.id + ">")) {
//
//         let str = message.content.toLowerCase().replace("<@!" + client.user.id + ">", "").trim();
//
//         if(str.startsWith('help')) {
//             raidchannel.send('Description: Sends your message at the time specified\nUsage: @mention <message> <time to notify in AM/PM>');
//             return;
//         }
//         let hour = 0; let minute = 0;
//         if(str.endsWith("pm")) {
//             hour += 12;
//             str = str.replace("pm", "").trim();
//         }
//         else if (str.endsWith("am")) {
//             str = str.replace("am", "").trim();
//         }
//         else {
//             raidchannel.send("use AM/PM format eg. 4:30PM, 5.30AM, 08:30am")
//         }
//         let match = str.match(time_regex);
//         hour += parseInt(match[1]);
//         if(match[4] !== undefined) {minute = parseInt(match[4])};
//         str = str.replace(match[0], "").trim();
//         scheduleCustomNotify(raidchannel, str, hour, minute);
//     }
// });
