const { Client, Collection } = require('discord.js');
const path = require('path');
const glob = require('glob');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

// Require the config.json file, and define our Client.
const config = require('./config');
const client = new Client();

// Create two Collections where we can store our commands and aliases in.
// Store these collections on the client object so we can access them inside commands etc.
client.commands = new Collection();
client.aliases = new Collection();

// Function that will load all commands from the given directory.
function loadCommands(cmdDir) {
    // Create an empty array that will store all the file paths for the commands,
    // and push all files to the array.
    const items = [];
    items.push(...glob.sync(`${path.join(__dirname, cmdDir)}/**/*.js`));

    // Iterate through each element of the items array and add the commands / aliases
    // to their respective Collection.
    for (const item of items) {
        // Remove any cached commands
        if (require.cache[require.resolve(item)]) delete require.cache[require.resolve(item)];

        // Store the command and aliases (if it has any) in their Collection.
        const command = require(item);
        client.commands.set(command.name, command);
        if (command.aliases) {
            for (const alias of command.aliases) {
                client.aliases.set(alias, command.name);
            }
        }
    }
    console.log('Commands was loaded...');
}
// Run function and pass the relative path to the 'commands' folder.
loadCommands('commands');

// Client ready event
client.on('ready', () => {
    console.log('Bot is ready...');
})
// Client message event, contains the logic for the command handler.
.on('message', message => {
    // Make sure the message contains the command prefix from the config.json.
    if (!message.content.startsWith(config.prefix) && !message.content.startsWith(config.gamePrefix)) return;
    // Make sure the message author isn't a bot.
    if (message.author.bot) return;
    // Make sure the channel the command is called in is a text channel.
    if (message.channel.type !== 'text') return;

    if (!config.channels.includes(message.channel.id) && !config.gameChannels.includes(message.channel.id)) return;

    /* Split the message content and store the command called, and the args.
    * The message will be split using space as arg separator.
    */
    let isGame = false;
    const cmd = message.content.split(/\s+/g)[0].slice(config.prefix.length) || message.content.split(/\s+/g)[0].slice(config.gamePrefix.length);
    const args = message.content.split(/\s+/g).slice(1);
    if (message.content.startsWith(config.gamePrefix)) isGame = true;
    if (isGame && !config.gameChannels.includes(message.channel.id)) return;

    try {
        // Check if the command called exists in either the commands Collection
        // or the aliases Collection.

        let command;
        if (client.commands.has(cmd)) {
            command = client.commands.get(cmd);
        } else if (client.aliases.has(cmd)) {
            command = client.commands.get(client.aliases.get(cmd));
        }


        // Make sure command is defined.
        if (!command) return;

        // If the command exists then run the execute function inside the command file.
        command.execute(client, message, args, isGame);
        console.log(`Ran command: ${command.name}`); // Print the command that was executed.
    } catch (err) {
        console.error(err);
    }
});
// Login
mongoose.connect(config.mongo.url, config.mongo.options).then(() => {
    console.log('Connected to MongoDB');
    client.login(config.token);
});

/*const uDb = require('./lib/lottery/users');
const eDb = require('./lib/lottery/entries');

const {getBalance, getConfirmations, toWei, getTransaction} = require('./lib/rpc');
const {getTransactions} = require('./lib/explorer');

setInterval(async () => {
    const pending = await uDb.find({status: 0});
    if (pending.length > 0) {
        pending.forEach(async(user) => {
            const balance = await getBalance(user.address, user.block);
            if ((balance/ toWei(1, 'ether')) >= config.lottery.join) {
                const tx = await getTransactions(user.address);
                if (tx.length > 0){
                    await uDb.update({discord: user.discord}, {$set: {hash: tx[0].txHash, status: 1}});
                }
            }
        });
    }
    const confirming = await uDb.find({status: 1});
    if (confirming.length > 0) {
        confirming.forEach(async(user) => {
            const tx = await getTransaction(user.hash);
            const confirmations = await getConfirmations(tx.blockNumber);
            if (confirmations >= config.lottery.confirmation) {
                await uDb.update({discord: user.discord}, {$set: {status: 2}});
            }
        });
    }
}, 5000);*/
