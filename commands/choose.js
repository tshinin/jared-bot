require('dotenv').config();

module.exports = {
	name: 'choose',
	args: true,
    description: 'Get the bot to choose between multiple options, must give at least two',
    usage: `${process.env.PREFIX}choose option 1 | option 2 | ... | option N`,
    cooldown: 5,
	execute(message, args) {
        //split the arguments by the '|' character and trim each element
        const options = args.join(" ").split("|").map(s => s.trim());

        //if only one option was given, exit early
        if (options.length < 2) {
            message.reply("You have to give at least two options to choose from! Separated using \'|\'");
            return;
        }

        //choose a random index ranging from 0 to length-1
        choice = Math.floor(Math.random()*options.length);

        //send that choice to the chat
        return message.channel.send(`${options[choice]}!`);
	},
};