const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("hello")
		.setDescription("Say Hello To me!"),
	async execute(interaction) {
		await interaction.reply({ content: "Choo choo! 🚅" });
	},
};
