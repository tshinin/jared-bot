const ytdl = require('ytdl-core');
const {queue} = require('../bot.js');
require('dotenv').config();

module.exports = {
	name: 'play',
	args: true,
    description: 'Play ',
    cooldown: 5,
    usage: `${process.env.PREFIX}play [youtube url]`,
	async execute(message, args) {
        const contract = queue.get(message.guild.id);
        const voiceChannel = message.member.voice.channel;
        
        if (!voiceChannel) {
            return message.reply ("Join a voice channel to play music!");
        }

        //Check if the bot has required permissions to play music
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('SPEAK') || !permissions.has('CONNECT')) {
            return message.reply("I don't have the permission to join and speak in your voice channel!");
        }

        //get song info from ytdl api
        const songInfo = await ytdl.getInfo(args[0]);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        if (!contract) {
            //create an object to store the relevent information about music session
            const queueContract = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            //associate the server with the contract
            queue.set(message.guild.id, queueContract);
            queueContract.songs.push(song);

            try {
                //join the channel and play the first song in the contract
                let connection = await voiceChannel.join();
                queueContract.connection = connection;
                play(message.guild, queueContract.songs[0]);
            } catch (error) {
                //On fail, delete the contract
                console.log(error);
                queue.delete(message.guild.id);
                return message.channel.send(error);
            }   
        } else {
            //add song to queue to be played after the current song
            contract.songs.push(song);
            return message.channel.send(`${song.title} is added to the queue!`)
        }
    },
};

function play(guild, song) {
        //end condition
        const contract = queue.get(guild.id);
        if (!song) {
            //when finished all the songs, leave the channel, delete the contract, and end
            contract.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }

        //Options to reduce likelihood of known ytdl ECCONRESET error
        const requestOptions = {
            filter: "audioonly",
            highWaterMark: 1 << 25
        }
        
        //play the readable stream returned by ytdl 
        const dispatcher = contract.connection
            .play(ytdl(song.url, requestOptions))
            .on("finish", () => {
                contract.songs.shift();
                play(guild, contract.songs[0]);
            })
            .on("error", error => {
                console.log(error);
                contract.textChannel.send('Ran into an unexpected error!');
            });
            dispatcher.setVolumeLogarithmic(contract.volume / 5);
            contract.textChannel.send(`Playing: **${song.title}**`);
}