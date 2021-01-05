const fetch = require('node-fetch');
require('dotenv').config();

module.exports = {
	name: 'kiss',
	args: true,
    description: '@ someone to kiss them.',
    usage: `${process.env.PREFIX}kiss @someuser`,
    cooldown: 5,
	async execute(message, args) {
        let keywords = "kiss";
        //request data from tenor api and then organize as a json object
        let url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENORKEY}&contentfilter=high`
        let response = await fetch(url);
        let json = await response.json();

        //choose a random result from the options given by tenor
        let index = Math.floor(Math.random()*json.results.length);
        message.channel.send(`${args}\n${json.results[index].url}`);
	},
};