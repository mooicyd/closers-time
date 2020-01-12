const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    var raidchannel = client.channels.get('665874872341233664');
    //665874872341233664 - VanillaIce Raid Notice Channel
    //665850004887306251 - DES Test Channel
    var schedule = require('node-schedule');

    //King of Voracity
    var kov_starting = schedule.scheduleJob('* 15 * * 0,2,4,6', function() {
      raidchannel.send("King of Voracity raid (LV 87) will open in 1 hour. Get ready!");
    })

    var kov_start = schedule.scheduleJob('* 16 * * 0,2,4,6', function() {
      raidchannel.send("King of Voracity raid (LV 87) has opened. The raid will remain open for the next 10 hours.");
    })

    var kov_ending = schedule.scheduleJob('* 0 * * 1,3,5,0', function() {
      raidchannel.send("King of Voracity raid (LV 87) will end in 2 hours.");
    })

    var kov_end = schedule.scheduleJob('* 2 * * 1,3,5,0', function() {
      raidchannel.send("King of Voracity raid (LV 87) has ended.");
    })


    //King of Flies
    var kof_starting = schedule.scheduleJob('* 15 * * 0,1,3,5', function() {
      raidchannel.send("King of Flies raid (LV 85) has open in 1 hour. Get ready!");
    })

    var kof_start = schedule.scheduleJob('* 16 * * 0,1,3,5', function() {
      raidchannel.send("King of Flies raid (LV 85) has opened. The raid will remain open for the next 10 hours.");
    })

    var kof_ending = schedule.scheduleJob('* 0 * * 1,2,4,6', function() {
      raidchannel.send("King of Flies raid (LV 85) will end in 2 hours.");
    })

    var kof_end = schedule.scheduleJob('* 2 * * 1,2,4,6', function() {
      raidchannel.send("King of Flies raid (LV 85) has ended.");
    })
});

client.login(auth.token);
