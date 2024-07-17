const fs = require("fs");
const path = require("path");
const defer = require("promise-defer");
const { DateTime, IANAZone, FixedOffsetZone } = require("luxon-business-days");

let bot = require("../index.js");
const minimumPermissions = [
	"VIEW_CHANNEL",
	"SEND_MESSAGES",
	"MANAGE_MESSAGES",
	"EMBED_LINKS",
	"ATTACH_FILES",
	"READ_MESSAGE_HISTORY",
];

function getGuildSettings(id) {
	// select file
	filePath = path.join(__dirname, "..", "data", id, "settings.json");
	// read file
	let storedData = readFile(filePath);
	return storedData;
}

function getSettings() {
	return require("../settings.js");
}

function formatLogMessage(message) {
	return `[${new Date().toUTCString()}] ${message}`;
}

function log(...logItems) {
	const logMessage = logItems.join(" ");
	const tripleGrave = "```";
	const logString = formatLogMessage(logMessage);
	const logChannelId = getSettings().secrets.log_discord_channel;
	const superAdmin = getSettings().secrets.super_admin;
	// send to all shards
	bot.client.shard
		.broadcastEval(
			`
    if (!'${logChannelId}') {
      console.log("no log channel defined");
    }
    // fetch log channel
    const channel = this.channels.cache.get('${logChannelId}');
    if (channel) { // check for channel on shard
      channel.send('${tripleGrave} ${logString} ${tripleGrave}');
      if ('${logString}'.includes("Bot is logged in.") || '${logString}'.includes("error running main message handler")) {
        channel.send("<@${superAdmin}>");
      }
      console.log('${logString}'); // send to console only once to avoid multiple lines
    }
  `,
		)
		.catch((err) => {
			console.log(err);
		});
}

function logError() {
	log("[ERROR]", Array.from(arguments).slice(1).join(" "));
}

function readFile(path) {
	try {
		return JSON.parse(fs.readFileSync(path, "utf8"));
	} catch (err) {
		log("error reading file " + err);
		// return valid JSON to trigger update
		return {};
	}
}

function readFileSettingsDefault(filePath, defaultValue) {
	try {
		const fileData = fs.readFileSync(filePath, "utf8");
		return JSON.parse(fileData);
	} catch (err) {
		if (err.code !== "ENOENT") {
			throw err;
		}

		fs.writeFileSync(filePath, defaultValue, {
			encoding: "utf8",
			flag: "wx",
		});
		return JSON.parse(defaultValue);
	}
}

const guildDatabasePath = path.join(
	__dirname,
	"..",
	"data",
	"guilddatabase.json",
);
let guildDatabase;

function getGuildDatabase() {
	guildDatabase = guildDatabase || readFile(guildDatabasePath);
	return guildDatabase;
}

function writeGuildDatabase() {
	const formattedJson = JSON.stringify(guildDatabase, "", "\t");
	fs.writeFile(guildDatabasePath, formattedJson, (err) => {
		if (!err) {
			return;
		}
		return logError("writing the guild database", err);
	});
}

function amendGuildDatabase(partialGuildDb) {
	Object.assign(guildDatabase, partialGuildDb);
	writeGuildDatabase();
}

function removeGuildFromDatabase(guildId) {
	delete guildDatabase[guildId];
	writeGuildDatabase();
}

function deleteFolderRecursive(path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function (file, index) {
			var curPath = path + "/" + file;
			if (fs.lstatSync(curPath).isDirectory()) {
				deleteFolderRecursive(curPath);
			} else {
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
}

function writeGuildSpecific(guildid, json, file) {
	let fullPath = path.join(__dirname, "..", "data", guildid, file + ".json");
	fs.writeFile(fullPath, JSON.stringify(json, "", "\t"), (err) => {
		if (err) {
			return log("error writing guild specific database: " + err);
		}
	});
}

const userStorePath = path.join(__dirname, "..", "data", "users.json");
const users = readFileSettingsDefault(userStorePath, "{}");

const userDefaults = {};

//uses cached version of user database
function amendUserSettings(userId, partialSettings) {
	users[userId] = Object.assign({}, users[userId], partialSettings);

	const formattedJson = JSON.stringify(users, "", "\t");
	fs.writeFile(userStorePath, formattedJson, (err) => {
		if (!err) {
			return;
		}
		return logError("writing the users database", err);
	});
}

function getUserSetting(userId, settingName) {
	const apparentSettings = Object.assing({}, userDefaults, users[userId]);
	return apparentSettings[settingName];
}

function mentioned(msg, x) {
	if (!Array.isArray(x)) {
		x = [x];
	}
	return (
		msg.mentions.has(bot.client.user.id) &&
		x.some((c) => msg.content.toLowerCase().includes(c))
	);
}

function firstUpper(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// timezone validation
function validateTz(tz) {
	return (
		IANAZone.isValidZone(tz) ||
		(FixedOffsetZone.parseSpecifier(tz) !== null &&
			FixedOffsetZone.parseSpecifier(tz).isValid)
	);
}

function sendMessageHandler(message, err) {
	if (err.message === "Missing Permissions") {
		return message.author.send(
			"Oh no! I don't have the right permissions in the channel you're trying to use me in! Toggle on all of the 'text permissions' for the **Niles** role",
		);
	} else {
		return log(err);
	}
}

function checkRole(message) {
	let guildSettings = getGuildSettings(message.guild.id, "settings");
	let userRoles = message.member.roles.cache.map((role) => role.name);
	if (guildSettings.allowedRoles.length === 0) {
		return true;
	}
	if (guildSettings.allowedRoles.length > 0) {
		if (userRoles.includes(guildSettings.allowedRoles[0])) {
			return true;
		} else {
			return false;
		}
	}
}

function checkPermissions(message) {
	let botPermissions = message.channel
		.permissionsFor(bot.client.user)
		.serialize(true);
	let missingPermissions = "";
	minimumPermissions.forEach(function (permission) {
		if (!botPermissions[permission]) {
			missingPermissions += "\n" + String(permission);
		}
	});
	if (missingPermissions !== "") {
		return false;
	}
	return true;
}

function checkPermissionsManual(message, cmd) {
	let botPermissions = message.channel
		.permissionsFor(bot.client.user)
		.serialize(true);
	let missingPermissions = "";
	minimumPermissions.forEach(function (permission) {
		if (!botPermissions[permission]) {
			missingPermissions += "\n" + String(permission);
		}
	});
	if (missingPermissions !== "") {
		return message.author.send(
			`Hey I noticed you tried to use the command \`\`${cmd}\`\`. I am missing the following permissions in channel **${message.channel.name}**: \`\`\`` +
				missingPermissions +
				"```" +
				"\nIf you want to stop getting these DMs type `!permissions 0` in this DM chat.",
		);
	}
	return message.author.send(
		`I have all the permissions I need in channel **${message.channel.name}**`,
	);
}

function yesThenCollector(message) {
	let p = defer();
	const collector = message.channel.createMessageCollector(
		(m) => message.author.id === m.author.id,
		{
			time: 30000,
		},
	);
	collector.on("collect", (m) => {
		if (["y", "yes"].includes(m.content.toLowerCase())) {
			p.resolve();
		} else {
			message.channel.send("Okay, I won't do that");
			p.reject();
		}
		collector.stop();
	});
	collector.on("end", (collected, reason) => {
		if (reason === "time") {
			return message.channel.send("Command response timeout");
		}
	});
	return p.promise;
}

/**
 * This helper function limits the amount of chars in a string to max trimLength and adds "..." if shortened.
 * @param {string} eventName - The name/summary of an event
 * @param {int} trimLength - the number of chars to trim the title to
 * @return {string} eventName - A string wit max 23 chars length
 */
function trimEventName(eventName, trimLength) {
	if (trimLength === null || trimLength === 0) {
		return eventName;
	}

	if (eventName.length > trimLength) {
		eventName = eventName.trim().substring(0, trimLength - 3) + "...";
	}
	return eventName;
}

module.exports = {
	deleteFolderRecursive,
	getGuildDatabase,
	getGuildSettings,
	removeGuildFromDatabase,
	writeGuildDatabase,
	amendGuildDatabase,
	writeGuildSpecific,
	amendUserSettings,
	getUserSetting,
	mentioned,
	firstUpper,
	validateTz,
	log,
	logError,
	readFile,
	sendMessageHandler,
	checkPermissions,
	checkPermissionsManual,
	checkRole,
	yesThenCollector,
	trimEventName,
};
