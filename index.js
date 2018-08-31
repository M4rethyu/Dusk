// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

const info = require("./games.json");

client.on("ready", () => {
	// This event will run if the bot starts, and logs in, successfully.
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
	// Example of changing the bot's playing game to something useful. `client.user` is what the
	// docs refer to as the "ClientUser".
	//client.user.setActivity(`Serving ${client.guilds.size} servers`);
	client.user.setActivity("with water");
	console.log(Object.keys(info).length);
	
	
	intervalID = setInterval(function(){interval();}, 20000);
});

client.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	//client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
	// this event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	//client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
	// This event will run on every single message received, from any channel or DM.

	//Ignores anything outside of its dedicated channel
	if(message.channel.name != "dusk") return;

	// It's good practice to ignore other bots. This also makes your bot ignore itself
	// and not get into a spam loop (we call that "botception").
	if(message.author.bot) return;

	// Also good practice to ignore any message that does not start with our prefix, 
	// which is set in the configuration file.
	
	/*
	if(message.content.indexOf(config.prefixA) === 0) {
		var prefix = config.prefixA;
	} else if (message.content.indexOf(config.prefixB) === 0) {
		var prefix = config.prefixB;
	} else {return;}
	/*
	
	// Here we separate our "command" name, and our "arguments" for the command. 
	// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	
	/*
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const user = message.author;
	const channel = message.channel;
	const server = message.guild;
	*/
	
	
	if(message.content.indexOf(config.prefixA) === 0) {
	//if(prefix === config.prefixA) {
		
		const args = message.content.slice(config.prefixA.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const user = message.author;
		const channel = message.channel;
		const server = message.guild;
		
		//Commands using the Prefix for channel-related commands (default: " + ")
		
		//create Channel, depending on command name.
		if (info[command] !== undefined) {
			if (makeChannel(server, info[command])) {
				channel.send(`${message.author}` + ", du hast einen **" + info[command] + "** Channel erstellt.")
			} else {
				channel.send(`${message.author}` + ", Es ist ein unerwarteter Fehler aufgetreten.")
			}
			return;
		}
		
		
	} else if (message.content.indexOf(config.prefixB) === 0) {
	//} else if (prefix === config.prefixB) {
		
		const args = message.content.slice(config.prefixB.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const user = message.author;
		const channel = message.channel;
		const server = message.guild;
		
		//Commands using the Prefix for tag-related commands (default: " - ")
		
		//toggle role for command user, depending on command name.
		if (info[command] !== undefined) {
			var member = message.member;
			var role = server.roles.find(testedrole => testedrole.name === info[command]);
			if (toggleRole(member, role)) {
				channel.send(`${message.author}` + ", dir wurde die Rolle **" + role.name + "** hinzugefügt.")
			} else {
				channel.send(`${message.author}` + ", dir wurde die Rolle **" + role.name + "** entfernt.")
			}
			return;
		}
		
		if(command === "ping") {
			// Calculates ping between sending a message and editing it, giving a nice round-trip latency.
			// The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
			const m = await message.channel.send("Ping?");
			m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
			return;
		}
		
	} else {return;}

	/*
	if(command === "deleteallchannels") {
		//var server = Client.guilds.get('Your server's ID');
		console.log(server.channels.array().length);
		for (var i = 0; i < server.channels.array().length; i++) {
			server.channels.array()[i].delete();
		}
		
		return;
	}
	*/
});

//=============//
//==Functions==//
//=============//

//called every 2 minutes
function interval()
{
	console.log('interval function was called');
	for (var i = 0; i < client.guilds.array().length; i++) {
		server = client.guilds.array()[i];
		checkChannels(server);
	}
}

function makeChannel(server, name){
	server.createChannel(name + " [aktiv]", "voice");
	return true;
}

function getChannels(server)
{
	console.log(`executing getChannels Function`);
	
	//server = client.guilds.get('434371297259028489');
		var activechannels = [];
		var inactivechannels = [];
		for (var i = 0; i < server.channels.array().length; i++) {
			currentchannel = server.channels.array()[i];
			if (currentchannel.name.includes("[aktiv]")) {
				activechannels.push(currentchannel);
			} else if (currentchannel.name.includes("[inaktiv]")) {
				inactivechannels.push(currentchannel);
			}
		}
		return [activechannels, inactivechannels];
}

function checkChannels(server)
{
	console.log(`executing checkChannels Function`);
	
	//Get active and inactive channels in arrays
	let channels = getChannels(server);
	let activechannels = channels[0];
	let inactivechannels = channels[1];
	
	//Going through active channels
	for (var i = 0; i < activechannels.length; i++) {
		currentchannel = activechannels[i];
		if (currentchannel.members.size === 0) {
			//Channel is empty: Set to inactive
			var nameparts = currentchannel.name.split(" ");
			nameparts[nameparts.length - 1] = "[inaktiv]";
			var newname = nameparts.join(" ");
			currentchannel.setName(newname);
		}
			//Channel currently used: Don't take any action
	}
	//Going through inactive channels
	for (var i = 0; i < inactivechannels.length; i++) {
		currentchannel = inactivechannels[i];
		if (currentchannel.members.size === 1) {
			//Channel currently used: Set back to active
			var nameparts = currentchannel.name.split(" ");
			nameparts[nameparts.length - 1] = "[aktiv]";
			var newname = nameparts.join(" ");
			currentchannel.setName(newname);
		} else {
			//Channel empty: Delete
			currentchannel.delete();
		}
	}
}


function checkForRole(member, role)
{
	//checks member for role
	if(member.roles.has(role.id)) {
		//member has role: return true
		return true;
	}
	//member doesn't have role: return false
	return false;
}

function toggleRole(member, role)
{
	//check if member has role
	if (!checkForRole(member, role)) {
		//member doesn't have role: add role
		member.addRole(role).catch(console.error);
		return true;
	} else {
		//member has role: remove role
		member.removeRole(role).catch(console.error);
		return false;
	}
}

function addRole(member, role)
{
	//check if member has role
	if (!checkForRole(member, role)) {
		//member doesn't have role: add role
		member.addRole(role).catch(console.error);
		return true;
	} else {
		//member has role: do nothing
		return true;
	}
}

function removeRole(member, role)
{
	//check if member has role
	if (!checkForRole(member, role)) {
		//member doesn't have role: do nothing
		return false;
	} else {
		//member has role: remove role
		member.removeRole(role).catch(console.error);
		return false;
	}
}

client.login(config.token);