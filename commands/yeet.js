const config = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
	name: 'yeet',
	args: true,
    description: '@ someone to yeet them through a gif.',
    usage: `${config.prefix}yeet @someuser`,
    cooldown: 5,
	async execute(message, args) {
        let keywords = "yeet";
        //request data from tenor api and then organize as a json object
        let url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENORKEY}&contentfilter=high`
        let response = await fetch(url);
        let json = await response.json();

        //choose a random result from the options given by tenor
        let index = Math.floor(Math.random()*json.results.length);
        message.channel.send(`${args}\n${json.results[index].url}`);
	},
};