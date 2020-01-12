const Discord = require('discord.js');
const client = new Discord.Client();
const v8 = require('v8');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    var raidchannel = client.channels.get('665850004887306251');
    //665874872341233664 - VanillaIce Raid Notice Channel
    //665850004887306251 - DES Test Channel
    var schedule = require('node-schedule-tz');
    const startingHour = 15; const startHour = 16; const endingHour = 0; const endHour = 2;
    const kovDays = [0,2,4,6]; const kofDays = [1,3,5,0]; const kofOffDays = [1,2,4,6]; const kovOffDays = [1,3,5,0];
    const korea = 'Asia/South Korea';

    //King of Voracity Timers
    var kov_rule1 = new schedule.RecurrenceRule();
    kov_rule1.minute = 0;
    kov_rule1.hour = startingHour;
    kov_rule1.dayOfWeek = kovDays;
    kov_rule1.tz = korea;

    var kov_rule2 = v8.deserialize(v8.serialize(kov_rule1));
    kov_rule2.hour = startHour;

    var kov_rule3 = v8.deserialize(v8.serialize(kov_rule2));
    kov_rule3.hour = endingHour;

    var kov_rule4 = v8.deserialize(v8.serialize(kov_rule3));
    kov_rule4.hour = endHour;
    kov_rule4.dayOfWeek = kovOffDays;

    //King of Flies Timers
    var kof_rule1 = v8.deserialize(v8.serialize(kov_rule1));
    kof_rule1.dayOfWeek = kofDays;

    var kof_rule2 = v8.deserialize(v8.serialize(kof_rule1));
    kof_rule2.hour = startHour;

    var kof_rule3 = v8.deserialize(v8.serialize(kof_rule2));
    kof_rule3.hour = endingHour;

    var kof_rule4 = v8.deserialize(v8.serialize(kof_rule3));
    kof_rule4.hour = endHour;
    kof_rule4.dayOfWeek = kofOffDays;

    var kov_starting = schedule.scheduleJob(kov_rule1, function() {
      raidchannel.send("King of Voracity raid (LV 87) will open in 1 hour. Get ready!");
    })

    var kov_start = schedule.scheduleJob(kov_rule2, function() {
      raidchannel.send("King of Voracity raid (LV 87) has opened. The raid will remain open for the next 10 hours.");
    })

    var kov_ending = schedule.scheduleJob(kov_rule3, function() {
      raidchannel.send("King of Voracity raid (LV 87) will end in 2 hours.");
    })

    var kov_end = schedule.scheduleJob(kov_rule4, function() {
      raidchannel.send("King of Voracity raid (LV 87) has ended.");
    })

    //King of Flies
    var kof_starting = schedule.scheduleJob(kof_rule1, function() {
      raidchannel.send("King of Flies raid (LV 85) has open in 1 hour. Get ready!");
    })

    var kof_start = schedule.scheduleJob(kof_rule2, function() {
      raidchannel.send("King of Flies raid (LV 85) has opened. The raid will remain open for the next 10 hours.");
    })

    var kof_ending = schedule.scheduleJob(kof_rule3, function() {
      raidchannel.send("King of Flies raid (LV 85) will end in 2 hours.");
    })

    var kof_end = schedule.scheduleJob(kof_rule4, function() {
      raidchannel.send("King of Flies raid (LV 85) has ended.");
    })
});

client.login(process.env.TOKEN);
