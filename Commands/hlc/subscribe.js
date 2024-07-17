const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

// const defaultUsers = [{ userId: "389957719538401290", subTypeFull: true }];
const defaultUsers = [];

const writeUsers = (json, file) => {
	let fullPath = path.join(__dirname, "..", "..", "data", file + ".json");
	fs.writeFile(fullPath, JSON.stringify(json, "", "\t"), (err) => {
		if (err) {
			return console.log("error writing users list: " + err);
		}
	});
};

const getUsers = (file) => {
	const filePath = path.join(__dirname, "..", "..", "data", file + ".json");
	// read file
	// let storedData = readFile(filePath);
	try {
		const currentUsers = JSON.parse(fs.readFileSync(filePath, "utf8"));
		console.log("file read");
		return currentUsers;
	} catch (err) {
		if (err.code !== "ENOENT") {
			console.log("error reading file " + path + err);
			throw err;
		}
		fs.writeFileSync(
			filePath,
			JSON.stringify(defaultUsers, "", "\t"),
			{
				encoding: "utf8",
				flag: "wx",
			},
			(err) => {
				if (err) throw err;
				console.log("The file has been saved!");
			},
		);
		console.log("error reading file " + path + err);
		// return valid JSON to trigger update
		return defaultUsers;
	}
	//merge defaults and stored settings to guarantee valid data
	// let combinedData = storedData.length > 0 ? storedData : defaultUsers;
	// return combinedData;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName("subscribe")
		.setDescription("Subscribes a user to VS DMs."),
	async execute(interaction) {
		const currentUsers = getUsers("userslist");
		const subChk = currentUsers.find(
			(user) => user.userId === interaction.user.id,
		);
		let newSubs = currentUsers;
		if (subChk) {
			console.log(`User subbed to alerts already`);
			await interaction.reply(`You are already subscribed to VS alerts`);
		} else {
			console.log(`User not subbed to alerts`);
			newSubs.push({ userId: interaction.user.id, subTypeFull: true });
			writeUsers(newSubs, "userslist");
			await interaction.reply(`You are now subscribed to VS alerts`);
		}
	},
};
