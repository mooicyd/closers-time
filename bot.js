const {Client} = require('discord.js');
const notify = require('./notify');
const client = new Client();
const translator = require('./translate')

let raidchannel;

//Automated Notification
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)

    raidchannel = client.channels.get(process.env.POST_CHANNEL_ID)
    notify.setupSchedule(raidchannel)
});

client.on('message', async function(message) {
    if(message.channel.id === process.env.READ_CHANNEL_ID &&
        message.content.startsWith("<@!" + client.user.id + ">")) {
            let messages = [];
            let str = message.content.toLowerCase().replace("<@!" + client.user.id + ">", "").trim();
            let channel = client.channels.get(message.channel.id);
            messages = await translator.translate(str);
            messages.forEach((msg) => channel.send(msg));
        }
});

client.login(process.env.TOKEN);
