const ytdl = require('ytdl-core');
const {queue} = require('../bot.js');
const config = require('../config.json');

module.exports = {
	name: 'play',
	args: true,
    description: 'Play ',
    cooldown: 5,
    usage: `${config.prefix}play [youtube url]`,
	async execute(message, args) {
		//Get information about the server for music functionality
        const serverQueue = queue.get(message.guild.id);
        //get the voice channel the user is in
        const voiceChannel = message.member.voice.channel;
        
        if (!voiceChannel) {
            return message.reply ("Join a voice channel to play music!");
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('SPEAK') || !permissions.has('CONNECT')) {
            return message.reply("I don't have the permission to join and speak in your voice channel!");
        }

        const songInfo = await ytdl.getInfo(args[0]);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        if (!serverQueue) {
            const queueContract = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            queue.set(message.guild.id, queueContract);
            queueContract.songs.push(song);

            try {
                let connection = await voiceChannel.join();
                queueContract.connection = connection;
                play(message.guild, queueContract.songs[0]);
            } catch (error) {
                console.log(error);
                queue.delete(message.guild.id);
                return message.channel.send(error);
            }   
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} is added to the queue!`)
        }
    },
};

function play(guild, song) {
        const serverQueue = queue.get(guild.id);
        if (!song) {
          serverQueue.voiceChannel.leave();
          queue.delete(guild.id);
          return;
        }

        const dispatcher = serverQueue.connection
            .play(ytdl(song.url, {filter: "audioonly"}))
            .on("finish", () => {
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Playing: **${song.title}**`);
}