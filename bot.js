const { Client } = require("discord.js");
const notify = require("./notify");
const client = new Client();
const translator = require("./translate");
const help = require("./help");
const info = require("./info");
const space_delimit = /\s+/;

let raidchannel;

//Automated Notification
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity(`@Closers Bot help`, { type: "WATCHING" });
  raidchannel = await client.channels.fetch(process.env.POST_CHANNEL_ID);
  notify.setupSchedule(raidchannel);
});

client.on("message", async function (message) {
  if (
    process.env.READ_CHANNEL_ID.includes(message.channel.id) &&
    message.content.startsWith("<@!" + client.user.id + ">")
  ) {
    let messages = [];
    let str = message.content
      .toLowerCase()
      .replace("<@!" + client.user.id + ">", "")
      .trim();
    let channel = await client.channels.fetch(message.channel.id);
    let command = str.split(space_delimit)[0];
    switch (command) {
      case "find":
        str = str.replace("find", "").trim();
        messages = await translator.translate(str);
        break;
      case "info":
        str = str.replace("info", "").trim();
        messages = info.info(str);
        break;
      default:
        messages.push("No such command, below are the available commands");
      case "help":
        str = str.replace("help", "").trim();
        messages = help.help(str);
        break;
    }
    messages.forEach((msg) => channel.send(msg));
  }
});

client.login(process.env.TOKEN);
