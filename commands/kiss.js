const config = require('../config.json');
const fetch = require('node-fetch');

module.exports = {
	name: 'kiss',
	args: true,
    description: '@ someone to kiss them.',
    usage: `${config.prefix}kiss @someuser`,
    cooldown: 5,
	async execute(message, args) {
        let keywords = "kiss";
        let url = `https://api.tenor.com/v1/search?q=${keywords}&key=${process.env.TENORKEY}&contentfilter=high`
        let response = await fetch(url);
        let json = await response.json();
        let index = Math.floor(Math.random()*json.results.length);
        message.channel.send(`${args}\n${json.results[index].url}`);
	},
};