const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const time_regex = /([0-9]+)(:|.)([0-9]+)/
const time_delimit = /(:|.)/
const schedule = require('node-schedule-tz');
var raidchannel;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //665874872341233664 - VanillaIce Raid Notice Channel
    //665850004887306251 - DES Test
    raidchannel = client.channels.get('665850004887306251');
});

client.on('message', function(message) {

    //VanlliaIce Moderator role: 549882162309103627
    //DES Moderator role: 667218218804314114
    if(message.channel.id === raidchannel.id
        && message.member.roles.has('667218218804314114')
        && message.content.startsWith("<@!" + client.user.id + ">")) {

        var str = message.content.toLowerCase().replace("<@!" + client.user.id + ">", "").trim();

        if(str.startsWith('help')) {
            raidchannel.send('Description: Sends your message at the time specified\nUsage: @mention <message> <time to notify in AM/PM>');
        }
        var hour = 0; var minute = 0;
        if(str.endsWith("pm")) {
            hour += 12;
            str = str.replace("pm", "").trim();
        }
        else if (str.endsWith("am")) {
            str = str.replace("am", "").trim();
        }
        else {
            raidchannel.send("use AM/PM format eg. 4:30PM, 5.30AM, 08:30am")
        }
        var match = str.match(time_regex)
        console.log(match);
        hour += parseInt(match[1]);
        minute = parseInt(match[3]);
        str = str.replace(match[0], "").trim();
        scheduleCustomNotify(raidchannel, str, hour, minute);
    }
});

client.login(auth.token);


function scheduleCustomNotify(channel, content, h, m) {
    console.log(content + " " + h + " " + m);
    var job = schedule.scheduleJob({hour: h, minute: m}, function () {
        channel.send(content);
    })
}
