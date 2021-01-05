require('dotenv').config();

module.exports = {
	name: 'cointoss',
	args: false,
    description: 'Get the bot to flip a coin!',
    usage: `${process.env.PREFIX}cointoss`,
    cooldown: 5,
	execute(message, args) {
        const options = ["heads", "tails"];

        //choose a random index ranging from 0 to 1
        choice = Math.floor(Math.random()*2);

        //send that choice to the chat
        return message.channel.send(`${options[choice]} wins!`);
	},
};