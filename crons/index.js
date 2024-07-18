const { CronJob } = require("cron");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const bot = require("../index.js");

const defaultUsers = [];
const getUsers = (file) => {
	const filePath = path.join(__dirname, "..", "data", file + ".json");
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
		return defaultUsers;
	}
};

const sendDms = async (embed) => {
	const currentUsers = getUsers("userslist");
	// console.log("currentUsers: ", currentUsers);
	for (const user of currentUsers) {
		let dmUser;
		try {
			dmUser = await bot.client.users.fetch(user.userId);
			// message.reply(`User found: ${user.tag}`);
			console.log(`User found: ${dmUser.username}`);
		} catch (error) {
			console.error("Error fetching user:", error);
		}
		await bot.client.users.send(dmUser, { embeds: [embed] });
		// user.send(`Message from HLc`).catch((e) => {
		// 	if (e.code !== 50007)
	}
};

const startCrons = () => {
	// const testJob = new CronJob(
	// 	"0 0 14 * * *", // Every 5 minutes
	// 	async function () {
	// 		console.log("Send out Day 1 preparation message");
	// 		const embed = new EmbedBuilder()
	// 			.setTitle("VS Day 1 Preparation")
	// 			.setDescription(
	// 				"- *Start collecting resources.* You'll want to set up on tiles that will finish at least 5m *after* server reset in about 10 hours. Depending on the tiles available and your collection speed you may want to start now or in an hour or so.\n- You should already have been saving radar tasks since yesterday.",
	// 			)
	// 			.setColor("#00b0f4")
	// 			.setFooter({
	// 				text: "HLc Bot",
	// 				iconURL: "https://i.imgur.com/hBDHIyv.jpg",
	// 			})
	// 			.setTimestamp();
	// 		// await sendDms(embed).catch((e) => console.error(e));
	// 		await bot.client.channels.cache
	// 			.get("1232113774048055327")
	// 			.send({ embeds: [embed] });
	// 	}, // onTick
	// 	null, // onComplete
	// 	true, // start
	// 	"America/Los_Angeles", // timeZone
	// );

	const prepareDay1Job = new CronJob(
		"0 0 9 * * 0", // 9 AM every Sunday
		async function () {
			console.log("Send out Day 1 preparation message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 1 Preparation")
				.setDescription(
					"- *Start collecting resources.* You'll want to set up on tiles that will finish at least 5m *after* server reset in about 10 hours. Depending on the tiles available and your collection speed you may want to start now or in an hour or so.\n- You should already have been saving radar tasks since yesterday.",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const day1Job = new CronJob(
		"0 0 19 * * 0", // 7 PM every Sunday
		async function () {
			console.log("Send out Day 1 message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 1")
				.setDescription(
					"**Score VS points with the following**\n- Complete radar tasks\n- Gather resources\n- Use stamina (note: this overlaps with the Drone Boost phase of Arms Race)\n- Use Drone Combat Data points (note: this overlaps with the Drone Boost phase of Arms Race)\n- Use hero XP (note: this overlaps with the Hero Advancement phase of Arms Race)\n- Open Drone Data Chip chests",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const prepareDay2Job = new CronJob(
		"0 0 9 * * 1", // 9 AM every Monday
		async function () {
			console.log("Send out Day 2 preparation message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 2 Preparation")
				.setDescription(
					"**Score VS points with the following**\n- Complete radar tasks\n- Gather resources\n- Use stamina (note: this overlaps with the Drone Boost phase of Arms Race)\n- Use Drone Combat Data points (note: this overlaps with the Drone Boost phase of Arms Race)\n- Use hero XP (note: this overlaps with the Hero Advancement phase of Arms Race)\n- Open Drone Data Chip chests",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const day2Job = new CronJob(
		"0 0 19 * * 1", // 7 PM every Monday
		async function () {
			console.log("Send out Day 2 message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 2")
				.setDescription(
					"**Score VS points with the following**\n- Use speed ups for construction (note: this overlaps with the City Building phase of Arms Race.)\n- Increase building power (note: you only score the points once you pop the present. Hopefully, you've been saving presents for a few days now. This overlaps with the City Building phase of Arms Race.)\n- Send out legendary Trade Trucks (note: only legendary (ylw) trucks count)\n- Perform legendary Secret Tasks (note: only legendary (ylw) tasks count)\n- Recruit survivors",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const prepareDay3Job = new CronJob(
		"0 0 9 * * 2", // 9 AM every Tuesday
		async function () {
			console.log("Send out Day 3 preparation message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 3 Preparation")
				.setDescription(
					"**Score VS points with the following**\n- Use speed ups for construction (note: this overlaps with the City Building phase of Arms Race.)\n- Increase building power (note: you only score the points once you pop the present. Hopefully, you've been saving presents for a few days now. This overlaps with the City Building phase of Arms Race.)\n- Send out legendary Trade Trucks (note: only legendary (ylw) trucks count)\n- Perform legendary Secret Tasks (note: only legendary (ylw) tasks count)\n- Recruit survivors",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const day3Job = new CronJob(
		"0 0 19 * * 2", // 7 PM every Tuesday
		async function () {
			console.log("Send out Day 3 message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 3")
				.setDescription(
					"**Score VS points with the following**\n- Use speed ups for construction (note: this overlaps with the City Building phase of Arms Race.)\n- Increase building power (note: you only score the points once you pop the present. Hopefully, you've been saving presents for a few days now. This overlaps with the City Building phase of Arms Race.)\n- Send out legendary Trade Trucks (note: only legendary (ylw) trucks count)\n- Perform legendary Secret Tasks (note: only legendary (ylw) tasks count)\n- Recruit survivors",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const prepareDay4Job = new CronJob(
		"0 0 9 * * 3", // 9 AM every Wednesday
		async function () {
			console.log("Send out Day 4 preparation message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 4 Preparation")
				.setDescription(
					"**Score VS points with the following**\n- Use speed ups for construction (note: this overlaps with the City Building phase of Arms Race.)\n- Increase building power (note: you only score the points once you pop the present. Hopefully, you've been saving presents for a few days now. This overlaps with the City Building phase of Arms Race.)\n- Send out legendary Trade Trucks (note: only legendary (ylw) trucks count)\n- Perform legendary Secret Tasks (note: only legendary (ylw) tasks count)\n- Recruit survivors",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const day4Job = new CronJob(
		"0 0 19 * * 3", // 7 PM every Wednesday
		async function () {
			console.log("Send out Day 4 message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 4")
				.setDescription(
					"**Score VS points with the following**\n- Use speed ups for construction (note: this overlaps with the City Building phase of Arms Race.)\n- Increase building power (note: you only score the points once you pop the present. Hopefully, you've been saving presents for a few days now. This overlaps with the City Building phase of Arms Race.)\n- Send out legendary Trade Trucks (note: only legendary (ylw) trucks count)\n- Perform legendary Secret Tasks (note: only legendary (ylw) tasks count)\n- Recruit survivors",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const prepareDay5Job = new CronJob(
		"0 0 9 * * 4", // 9 AM every Thursday
		async function () {
			console.log("Send out Day 5 preparation message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 5 Preparation")
				.setDescription(
					"**Score VS points with the following**\n- Use speed ups for construction (note: this overlaps with the City Building phase of Arms Race.)\n- Increase building power (note: you only score the points once you pop the present. Hopefully, you've been saving presents for a few days now. This overlaps with the City Building phase of Arms Race.)\n- Send out legendary Trade Trucks (note: only legendary (ylw) trucks count)\n- Perform legendary Secret Tasks (note: only legendary (ylw) tasks count)\n- Recruit survivors",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const day5Job = new CronJob(
		"0 0 19 * * 4", // 7 PM every Thursday
		async function () {
			console.log("Send out Day 5 message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 5")
				.setDescription(
					"**Score VS points with the following**\n- Use speed ups for construction (note: this overlaps with the City Building phase of Arms Race.)\n- Increase building power (note: you only score the points once you pop the present. Hopefully, you've been saving presents for a few days now. This overlaps with the City Building phase of Arms Race.)\n- Send out legendary Trade Trucks (note: only legendary (ylw) trucks count)\n- Perform legendary Secret Tasks (note: only legendary (ylw) tasks count)\n- Recruit survivors",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const prepareDay6Job = new CronJob(
		"0 0 9 * * 5", // 9 AM every Friday
		async function () {
			console.log("Send out Day 6 preparation message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 6 Preparation")
				.setDescription(
					"**Score VS points with the following**\n- Use speed ups for construction (note: this overlaps with the City Building phase of Arms Race.)\n- Increase building power (note: you only score the points once you pop the present. Hopefully, you've been saving presents for a few days now. This overlaps with the City Building phase of Arms Race.)\n- Send out legendary Trade Trucks (note: only legendary (ylw) trucks count)\n- Perform legendary Secret Tasks (note: only legendary (ylw) tasks count)\n- Recruit survivors",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);

	const day6Job = new CronJob(
		"0 0 19 * * 5", // 7 PM every Friday
		async function () {
			console.log("Send out Day 6 message");
			const embed = new EmbedBuilder()
				.setTitle("VS Day 6")
				.setDescription(
					"**Score VS points with the following**\n- Use speed ups for construction (note: this overlaps with the City Building phase of Arms Race.)\n- Increase building power (note: you only score the points once you pop the present. Hopefully, you've been saving presents for a few days now. This overlaps with the City Building phase of Arms Race.)\n- Send out legendary Trade Trucks (note: only legendary (ylw) trucks count)\n- Perform legendary Secret Tasks (note: only legendary (ylw) tasks count)\n- Recruit survivors",
				)
				.setColor("#00b0f4")
				.setFooter({
					text: "HLc Bot",
					iconURL: "https://i.imgur.com/hBDHIyv.jpg",
				})
				.setTimestamp();
			await sendDms(embed).catch((e) => console.error(e));
		}, // onTick
		null, // onComplete
		true, // start
		"America/Los_Angeles", // timeZone
	);
};

module.exports = {
	startCrons,
};
