const { Events } = require("discord.js");
const { startCrons } = require("../crons/index");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		startCrons();
	},
};
