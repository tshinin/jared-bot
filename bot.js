const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log("ready");
});

client.on('message', (msg) => {
    if (msg.content === 'Ping!') {
        msg.channel.send("Pong!");
    }
});