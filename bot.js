const {Client} = require('discord.js');
const notify = require('./notify');
const client = new Client();
const translator = require('./translate')
const help = require('./help')
const info = require('./info')

let raidchannel;

//Automated Notification
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity("@mention help", {type: 'WATCHING'})
    raidchannel = client.channels.get(process.env.POST_CHANNEL_ID)
    notify.setupSchedule(raidchannel)
});

client.on('message', async function(message) {
    if(message.channel.id === process.env.READ_CHANNEL_ID &&
        message.content.startsWith("<@!" + client.user.id + ">")) {
            let messages = [];
            let str = message.content.toLowerCase().replace("<@!" + client.user.id + ">", "").trim();
            let channel = client.channels.get(message.channel.id);
            if(str.startsWith("find")) {
                str = str.replace("find", "").trim();
                messages = await translator.translate(str);
            }
            else if(str.startsWith("info")) {
                str = str.replace("info", "").trim();
                messages = info.info(str);
            }
            else if(str.startsWith("help")) {
                str = str.replace("help", "").trim();
                messages = help.help(str);
            }
            else {
                messages = help.help("");
                messages.unshift("No such command, below are the available commands");
            }
            messages.forEach((msg) => channel.send(msg));
        }
});

client.login(process.env.TOKEN);
