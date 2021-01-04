const {queue} = require('../bot.js');

module.exports = {
	name: 'stop',
	args: false,
    description: 'Stop the song currently playing',
    cooldown: 5,
	execute(message, args) {
        const contract = queue.get(message.guild.id);
        
        if (!message.member.voice.channel)
        return message.channel.send(
          "You have to be in a voice channel to stop the music!"
        );
        
        if (!contract)
            return message.channel.send("There is no song that I could stop!");
            
        contract.songs = [];
        contract.connection.dispatcher.end();
	},
};