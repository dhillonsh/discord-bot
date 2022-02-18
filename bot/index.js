const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [{
  name: 'ping',
  description: 'Replies with Pong!'
}]; 

const rest = new REST({ version: '9' }).setToken('token');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands("940820823047041054", "940818420113498183"),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();




let tictactoe_state;

function makeGrid() {
	components = []
	
	for (let row = 0; row < 3; row++) {
		actionRow = new MessageActionRow()

		for (let col = 0; col < 3; col++) {
			switch(tictactoe_state[row][col]) {
				case -1:
					actionRow.addComponents(new MessageButton()
					.setCustomId('tictactoe_' + (row * 3 + col))
					.setLabel(' ')
					.setStyle('SECONDARY'))
					break;
				case 0:
					actionRow.addComponents(new MessageButton()
					.setCustomId('tictactoe_' + (row * 3 + col))
					.setLabel('X')
					.setStyle('PRIMARY'))
					break;
				case 1:
					actionRow.addComponents(new MessageButton()
					.setCustomId('tictactoe_' + (row * 3 + col))
					.setLabel('O')
					.setStyle('DANGER'))
					break;
			}

		}
		components.push(actionRow)
	} 

	return components
}

function getGridCoordinates(position) {
	return [parseInt(position / 3), position % 3]
}

function isGameOver() {
	console.log(tictactoe_state);
	for (let row = 0; row < 3; row++) {
	 	if (tictactoe_state[row][0] !== -1 && tictactoe_state[row][0] === tictactoe_state[row][1] && tictactoe_state[row][1] === tictactoe_state[row][2]) {
	 		console.log("case 1");
	 		console.log(tictactoe_state[row]);
	 		return true
	 	}
	 }
	 
	 for (let col = 0; col < 3; col++) {
	 	if (tictactoe_state[0][col] !== -1 && tictactoe_state[0][col] === tictactoe_state[1][col] && tictactoe_state[1][col] === tictactoe_state[2][col]) {
	 		console.log("case 2");
	 		return true
	 	}
	 }
 
 	if (tictactoe_state[0][0] !== -1 && tictactoe_state[0][0] === tictactoe_state[1][1] && tictactoe_state[1][1] === tictactoe_state[2][2]) {
 		console.log("case 3");
 		return true
 	}
 
  	if (tictactoe_state[0][2] !== -1 && tictactoe_state[0][2] === tictactoe_state[1][1] && tictactoe_state[1][1] === tictactoe_state[2][0]) {
 		console.log("case 4");
 		return true
 	}
 
	 return false
}

function isDraw() {
	for (let row = 0; row < 3; row++) {
		for (let col = 0; col < 3; col++) {
			if (tictactoe_state[row][col] === -1) {
				return false
			}
		}
	}
	return true
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const { MessageActionRow, MessageButton } = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	if (interaction.customId.startsWith("tictactoe")) {
		const position = parseInt(interaction.customId.substring(10));
		const coordinates = getGridCoordinates(position);
		
		tictactoe_state[coordinates[0]][coordinates[1]] = 0;
		
		// Is the game over?
		if (isGameOver()) {
			interaction.update({
				content: "You won the game of tic-tac-toe",
				components: []
			});
			return;
		}
		
		if (isDraw()) {
			interaction.update({
				content: "The game of tic-tac-toe ended in a draw",
				components: []
			});
			return;
		}
		
		// Bot picks a random square
		let botCoordinates;
		do {
			let botPosition = getRandomInt(8);
			botCoordinates = getGridCoordinates(botPosition);
		}
		while (tictactoe_state[botCoordinates[0]][botCoordinates[1]] != -1)
		tictactoe_state[botCoordinates[0]][botCoordinates[1]] = 1
		
		if(isGameOver()) {
			interaction.update({
				content: "The bot won the game of tic-tac-toe",
				components: makeGrid()
			});
			return;
		}
		
		interaction.update({
			components: makeGrid()
		});
	}
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'basic-command') {
  	tictactoe_state = [
		[-1, -1, -1],
		[-1, -1, -1],
		[-1, -1, -1]
	]
	

	await interaction.reply({ content: 'Playing a game of tic-tac-toe!', components: makeGrid() });
  }
});

client.login('OTQwODIwODIzMDQ3MDQxMDU0.YgM9qw.Ew14YOwuepKSddLs1YTgdm11KBg');
