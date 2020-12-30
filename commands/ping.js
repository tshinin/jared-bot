module.exports = {
	name: 'ping',
	args: false,
    description: 'Ping!',
    cooldown: 5,
	execute(message, args) {
		message.channel.send('Pong.');
	},
};