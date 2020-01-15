const Discord = require('discord.js');
const client = new Discord.Client();
const v8 = require('v8');
const schedule = require('node-schedule-tz');
const NDEF = -1;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    var raidchannel = client.channels.get(process.env.CHANNEL_ID);

    const RAID_STARTING_H = 15; const RAID_START_H = 16; const RAID_ENDING_H = 0; const RAID_END_H = 2;
    const ONE_HOUR = 3600000; const TWO_HOUR = 7200000; const THIRTY_MIN = 1800000; const FIVE_MIN = 300000; const HALF_HOUR = 30;
    const KOV_DAYS = [0,2,4,6]; const KOF_DAYS = [1,3,5,0]; const NO_KOF_DAYS = [1,2,4,6]; const NO_KOV_DAYS = [1,3,5,0];
    const KOV_RAID = "King of Voracity raid (LV87) "; const KOF_RAID = "King of Flies raid (LV85) "; const KOF_IMG = "\nhttps://imgur.com/PJVbqvz"; const KOV_IMG = "\nhttps://imgur.com/eVboHcQ";
    const RAID_STARTING = "will open in 1 hour. Get Ready!"; const RAID_START = "has opened. The raid will remain open for the next 10 hours."; const RAID_ENDING = "will end in 2 hours.";
    const RAID_END = "has ended."; const OVERFLOOD = "Overflood "; const OF_L_START = "has opened. The dungeon will remain open for 1 hour."; const OF_S_START = "has opened. The dungeon will remain open for 30 minutes.";
    const OF_L_TIMES = [10, 15, 18, 20, 23]; const OF_S_TIMES = [0, 1]; const OF_IMG = "\nhttps://imgur.com/DrfvjPv";

    //King of Voracity Timers
    var kov_rule1 = new schedule.RecurrenceRule();
    kov_rule1.minute = 0;
    kov_rule1.hour = RAID_STARTING_H;
    kov_rule1.dayOfWeek = KOV_DAYS;

    var kov_rule2 = v8.deserialize(v8.serialize(kov_rule1));
    kov_rule2.hour = RAID_START_H;

    var kov_rule3 = v8.deserialize(v8.serialize(kov_rule2));
    kov_rule3.hour = RAID_ENDING_H;
    kov_rule3.dayOfWeek = NO_KOV_DAYS;

    var kov_rule4 = v8.deserialize(v8.serialize(kov_rule3));
    kov_rule4.hour = RAID_END_H;

    //King of Flies Timers
    var kof_rule1 = v8.deserialize(v8.serialize(kov_rule1));
    kof_rule1.dayOfWeek = KOF_DAYS;

    var kof_rule2 = v8.deserialize(v8.serialize(kof_rule1));
    kof_rule2.hour = RAID_START_H;

    var kof_rule3 = v8.deserialize(v8.serialize(kof_rule2));
    kof_rule3.hour = RAID_ENDING_H;
    kof_rule3.dayOfWeek = NO_KOF_DAYS;

    var kof_rule4 = v8.deserialize(v8.serialize(kof_rule3));
    kof_rule4.hour = RAID_END_H;

    //King of Voracity

    var ofLong = setUpRulesHM(OF_L_TIMES);

    ofLong.forEach(function(rule) {
        scheduleMessage(raidchannel, OVERFLOOD, rule, OF_L_START, ONE_HOUR, OF_IMG);
    })

    var ofShort = setUpRulesHM(OF_S_TIMES, HALF_HOUR);

    ofShort.forEach(function(rule) {
        scheduleMessage(raidchannel, OVERFLOOD, rule, OF_S_START, THIRTY_MIN, OF_IMG);
    })

    scheduleMessage(raidchannel, KOV_RAID, kov_rule1, RAID_STARTING, ONE_HOUR);
    scheduleMessage(raidchannel, KOV_RAID, kov_rule2, RAID_START, NDEF, KOV_IMG);
    scheduleMessage(raidchannel, KOV_RAID, kov_rule3, RAID_ENDING, TWO_HOUR);
    scheduleMessage(raidchannel, KOV_RAID, kov_rule4, RAID_END, NDEF);

    scheduleMessage(raidchannel, KOF_RAID, kof_rule1, RAID_STARTING, ONE_HOUR);
    scheduleMessage(raidchannel, KOF_RAID, kof_rule2, RAID_START, NDEF, KOF_IMG);
    scheduleMessage(raidchannel, KOF_RAID, kof_rule3, RAID_ENDING, TWO_HOUR);
    scheduleMessage(raidchannel, KOF_RAID, kof_rule4, RAID_END, NDEF);

    clearMessages(raidchannel);
});

client.login(process.env.TOKEN);

function setUpRulesHM(hours, min) {
    if(min === undefined) {
        min = 0;
    }
    var rules = new Array();
    hours.forEach(function(value) {
        var rule = new schedule.RecurrenceRule();
        rule.minute = min;
        rule.hour = value;
        rules.push(rule);
    })
    return rules;
}

function scheduleMessage(channel, dungeon, rule, status, timeout, image) {
    if(image === undefined) {
        image = "";
    }

    var job = schedule.scheduleJob(rule, function () {
        channel.send(dungeon + status + image).then(function(msg) {
            if(timeout !== NDEF) {
                msg.delete(timeout)
            }
        });
    })
}

function clearMessages(channel) {
    var cleanup_rule = new schedule.RecurrenceRule();
    cleanup_rule.minute = 0;
    cleanup_rule.hour = 4;

    var cleanup = schedule.scheduleJob(cleanup_rule, function() {
      channel.bulkDelete(100).then(msg => console.log(`Cleaned ${msg.size} messages`));
  });
}
