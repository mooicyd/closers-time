const {Client, RichEmbed} = require('discord.js');
const client = new Client();
const v8 = require('v8');
const schedule = require('node-schedule-tz');
const NDEF = -1;
const time_regex = /([0-9]+)((:|.)([0-9]+))*/
const time_delimit = /(:|.)/
const {google} = require('googleapis');
const sheets = google.sheets({version: 'v4'});
const RAID_STARTING_H = 15; const RAID_START_H = 16; const RAID_ENDING_H = 0; const RAID_END_H = 2;
const ONE_HOUR = 3600000; const TWO_HOUR = 7200000; const THIRTY_MIN = 1800000; const FIVE_MIN = 300000; const HALF_HOUR = 30;
const KOV_DAYS = [0,2,4,6]; const KOF_DAYS = [1,3,5,0]; const NO_KOF_DAYS = [1,2,4,6]; const NO_KOV_DAYS = [1,3,5,0];
const KOV_RAID = "King of Voracity raid (LV87) "; const KOF_RAID = "King of Flies raid (LV85) "; const KOF_IMG = "\nhttps://imgur.com/PJVbqvz"; const KOV_IMG = "\nhttps://imgur.com/eVboHcQ";
const RAID_STARTING = "will open in 1 hour. Get Ready!"; const RAID_START = "has opened. The raid will remain open for the next 10 hours."; const RAID_ENDING = "will end in 2 hours.";
const RAID_END = "has ended."; const OVERFLOOD = "Overflood "; const OF_L_START = "has opened. The dungeon will remain open for 1 hour."; const OF_S_START = "has opened. The dungeon will remain open for 30 minutes.";
const OF_L_TIMES = [10, 15, 18, 20, 23]; const OF_S_TIMES = [0, 1]; const OF_IMG = "\nhttps://imgur.com/DrfvjPv"; const SEA_IMG = "\nhttps://i.imgur.com/IOzsjaZ.png";
const SEA_DAYS = [3,6,0]; const SEA_START = "is open for today. The dungeon will be closed when this message is deleted."; const YOD_SEA = "Yod Sea (LV86) "; const WILL_OPEN = " will open today in 12 hours."

var raidchannel;

//Automated Notification
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    raidchannel = client.channels.get(process.env.POST_CHANNEL_ID);

    var kovStartingRule = new schedule.RecurrenceRule();
    kovStartingRule.minute = 0;
    kovStartingRule.hour = RAID_STARTING_H;
    kovStartingRule.dayOfWeek = KOV_DAYS;

    var kovStartRule = copy(kovStartingRule);
    kovStartRule.hour = RAID_START_H;

    var kovEndingRule = copy(kovStartRule);
    kovEndingRule.hour = RAID_ENDING_H;
    kovEndingRule.dayOfWeek = NO_KOV_DAYS;

    var kovEndRule = copy(kovEndingRule);
    kovEndRule.hour = RAID_END_H;

    //King of Flies Timers
    var kofStartingRule = copy(kovStartingRule);
    kofStartingRule.dayOfWeek = KOF_DAYS;

    var kofStartRule = copy(kofStartingRule);
    kofStartRule.hour = RAID_START_H;

    var kofEndingRule = copy(kofStartRule);
    kofEndingRule.hour = RAID_ENDING_H;
    kofEndingRule.dayOfWeek = NO_KOF_DAYS;

    var kofEndRule = copy(kofEndingRule);
    kofEndRule.hour = RAID_END_H;

    //Overflood timers
    var ofLong = setUpRules({hours: OF_L_TIMES});

    ofLong.forEach(function(rule) {
        let messageObj = { channel: raidchannel, dungeon: OVERFLOOD, rule: rule, status: OF_L_START, timeout: ONE_HOUR, img: OF_IMG};
        scheduleMessage(messageObj);
    })

    var ofShort = setUpRules({hours: OF_S_TIMES, min: HALF_HOUR});

    ofShort.forEach(function(rule) {
        let messageObj = { channel: raidchannel, dungeon: OVERFLOOD, rule: rule, status: OF_S_START, timeout: THIRTY_MIN, img: OF_IMG};
        scheduleMessage(messageObj);
    })

    //King of Voracity
    var kov_starting = { channel: raidchannel, dungeon: KOV_RAID, rule: kovStartingRule, status: RAID_STARTING, timeout: ONE_HOUR};
    var kov_start = { channel: raidchannel, dungeon: KOV_RAID, rule: kovStartRule, status: RAID_START, img: KOV_IMG};
    var kov_ending = { channel: raidchannel, dungeon: KOV_RAID, rule: kovEndingRule, status: RAID_ENDING, timeout: TWO_HOUR, img: KOV_IMG};
    var kov_end = { channel: raidchannel, dungeon: KOV_RAID, rule: kovEndingRule, status: RAID_END};

    scheduleMessage(kov_starting);
    scheduleMessage(kov_start);
    scheduleMessage(kov_ending);
    scheduleMessage(kov_end);

    //King of Flies
    var kof_starting = { channel: raidchannel, dungeon: KOF_RAID, rule: kofStartingRule, status: RAID_STARTING, timeout: ONE_HOUR};
    var kof_start = { channel: raidchannel, dungeon: KOF_RAID, rule: kofStartRule, status: RAID_START, img: KOF_IMG};
    var kof_ending = { channel: raidchannel, dungeon: KOF_RAID, rule: kofEndingRule, status: RAID_ENDING, timeout: TWO_HOUR, img: KOF_IMG};
    var kof_end = { channel: raidchannel, dungeon: KOF_RAID, rule: kofEndingRule, status: RAID_END};

    scheduleMessage(kof_starting);
    scheduleMessage(kof_start);
    scheduleMessage(kof_ending);
    scheduleMessage(kof_end);

    clearMessages(raidchannel);

    //Yod Sea
    var sea_rule = new schedule.RecurrenceRule();
    sea_rule.minute = 1;
    sea_rule.hour = 4;
    sea_rule.dayOfWeek = SEA_DAYS;
    var sea_days = { channel: raidchannel, dungeon: YOD_SEA, rule: sea_rule, status: SEA_START, img: SEA_IMG}
    scheduleMessage(sea_days);

    //KoF day
    var kof_day_rule = new schedule.RecurrenceRule();
    kof_day_rule.minute = 1;
    kof_day_rule.hour = 4;
    kof_day_rule.dayOfWeek = KOF_DAYS;
    var kof_days = { channel: raidchannel, dungeon: KOF_RAID, rule: kof_day_rule, status: WILL_OPEN, img: KOF_IMG};
    scheduleMessage(kof_days);

    //KoV day
    var kov_day_rule = new schedule.RecurrenceRule();
    kov_day_rule.minute = 1;
    kov_day_rule.hour = 4;
    kov_day_rule.dayOfWeek = KOV_DAYS;
    var kov_days = { channel: raidchannel, dungeon: KOV_RAID, rule: kov_day_rule, status: WILL_OPEN, img: KOV_IMG};
    scheduleMessage(kov_days);
});

//Custom Notification
// client.on('message', function(message) {
//
//     if(message.channel.id === process.env.READ_CHANNEL_ID
//         && message.member.roles.has(process.env.ROLE_ID)
//         && message.content.startsWith("<@!" + client.user.id + ">")) {
//
//         var str = message.content.toLowerCase().replace("<@!" + client.user.id + ">", "").trim();
//
//         if(str.startsWith('help')) {
//             raidchannel.send('Description: Sends your message at the time specified\nUsage: @mention <message> <time to notify in AM/PM>');
//             return;
//         }
//         var hour = 0; var minute = 0;
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
//         var match = str.match(time_regex);
//         hour += parseInt(match[1]);
//         if(match[4] !== undefined) {minute = parseInt(match[4])};
//         str = str.replace(match[0], "").trim();
//         scheduleCustomNotify(raidchannel, str, hour, minute);
//     }
// });

client.on('message', async function(message) {
    if(message.channel.id === process.env.READ_CHANNEL_ID &&
        message.content.startsWith("<@!" + client.user.id + ">")) {
            var str = message.content.toLowerCase().replace("<@!" + client.user.id + ">", "").trim();
            await translate(str, message.channel.id);
        }
});

client.login(process.env.TOKEN);

async function translate(query, channelId) {
    var channel = client.channels.get(channelId);
    const sheetUrl = "<https://docs.google.com/spreadsheets/d/1iLTnTcC_xJ2WfTonqusuQkCIvQsUm2GNpsxoPQ5JzDQ/edit#gid=0>";
    var results = [];

    if(query.length < 3 || query == "help") {
        await channel.send(`You may view the spreadsheet for the list of items and aliases: ${sheetUrl}`);
        return;
    }
    const params = {
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Sheet1',
        majorDimension: 'ROWS',
        valueRenderOption: 'FORMATTED_VALUE',
        key: process.env.GOOGLE_API_KEY,
    };

    try {
        const response = (await sheets.spreadsheets.values.get(params)).data;
        if(response == null) {
            await channel.send(`Unable to find spreadsheet or spreadsheet is empty, you may access the sheet at ${sheetUrl}`);
            return;
        }
        var res_val = response["values"];
        res_val.forEach(function(element) {
            if(element[3].toLowerCase().includes(query.toLowerCase())) {
                var embed = new RichEmbed()
                .setTitle(element[1])
                .setThumbnail(element[4])
                .addField("Hangul", element[2])
                .addField("Alias(es)", element[3]);
                if(element[5]) {
                    embed.addField("Notes", element[5]);
                }
                results.push(embed);
        }});
        if(results.length == 0) {
            await channel.send(`No results found for "${query}", you may verify if the alias is found in ${sheetUrl}`);
            return;
        } else {
            await channel.send(`Matching results for "${query}":`);
            while(results.length > 0) {
                await channel.send(results.pop());
            }
            return;
        }
    } catch (e) {
        console.log(e);
    };
}

function setUpRules(obj) {
    var rules = new Array();
    obj.hours.forEach(function(value) {
        var rule = new schedule.RecurrenceRule();
        rule.minute = ((obj.min)? obj.min: 0);
        rule.hour = value;
        rules.push(rule);
    });
    return rules;
}

function scheduleMessage(message) {
    var job = schedule.scheduleJob(message.rule, function () {
        console.log(message.dungeon + message.status);
        message.channel.send(`${message.dungeon}${message.status}${(message.img?message.img:"")}`).then(function(msg) {
            if(message.timeout) {
                msg.delete(timeout);
            }
        });
    })
}

function clearMessages(channel) {
    var cleanup_rule = new schedule.RecurrenceRule();
    cleanup_rule.minute = 0;
    cleanup_rule.hour = 4;

    var cleanup = schedule.scheduleJob(cleanup_rule, function() {
      channel.bulkDelete(10).then(msg => console.log(`Cleaned ${msg.size} messages`));
  });
}

function scheduleCustomNotify(channel, content, h, m) {
    var job = schedule.scheduleJob({hour: h, minute: m}, function () {
        channel.send(content);
    })
    return job;
}

function copy(obj) {
    return v8.deserialize(v8.serialize(obj));
}
