const Discord = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
require('dotenv').config();

const client = new Discord.Client();

//Create a new collection for all of the bots commands 
client.commands = new Discord.Collection();

//Create an array with all of the command files 
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//Map each command name to its file
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    //Set a new item in the collection with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.on('ready', () => {
    console.log("ready!");
});

client.on('message', (msg) => {
    //Exit early if message was not a command
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    //extract the command and its arguments
    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    //exit early if command is invalid
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    //If the command requires arguments, check for no arguments
    if (command.args && !args.length) {
        let botReply = "No arguments were given!";

        //if the correct usage is established, let the user know
        if (command.usage) {
            botReply += `\nThe proper usage would be  \`${command.usage}\'`;
        }

        return msg.reply(botReply);
    }

    //If a command is not accounted for in the cooldowns collection, include it
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    //Check if the timestamps collection already has a user associated with a cooldown
    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
        
        //if the cooldown period has not finished, alert the user
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return msg.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    } else {
        //if a command is used successfully, set their id in timestamps
        timestamps.set(msg.author.id, now);
        //delete the timestamps entry after the cooldown period so the user can use the command again
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
    }

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('That command could not be executed!');
    }
});

client.login(process.env.TOKEN);
