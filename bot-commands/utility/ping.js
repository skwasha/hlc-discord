const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong! + bots latency!"),
	async execute(interaction, client) {
		await interaction.reply({
			content: `Pong! \`${client.ws.ping}ms\` 🏓`,
			ephemeral: true,
		});
	},
};
