const config = require('../config.json');

module.exports = {
	name: 'help',
    description: 'List all of the commands or info regarding a specific command',
    cooldown: 5,
	execute(message, args) {
        const data = [];
        const { commands } = message.client;

        //If no arguments are given, provide info for all commands
        if (!args.length) {
            data.push("Here are all my commands!");
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can use \'${config.prefix}help [command name]\' to get help for a specific command`);

            return message.channel.send(data, {split: true})
            .catch (error => {
                console.error(`Could not execute help command for ${message.author.tag}.\n`, error);
            });
        } else {
            //try to get the command user wished for
            const name = args[0].toLowerCase();
            const command = commands.get(name);

            if (!command) {
                return message.reply("Not a valid command!");
            }

            //Push necessary info onto the data array
            data.push(`Name: ${command.name}`);
            
            if (command.aliases) data.push(`Aliases: ${command.aliases.join(', ')}`);
            if (command.description) data.push(`Description: ${command.description}`);
            if (command.usage) data.push(`Usage: ${config.prefix}${command.name} ${command.usage}`);

            data.push(`Cooldown: ${command.cooldown || 3} second(s)`);

            message.channel.send(data, { split: true });
        } 
	},
};