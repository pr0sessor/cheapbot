const { MessageEmbed } = require('discord.js');

const {Entries} = require('../../../models');

module.exports = {
    group: 'Lottery',
    name: 'entries',
    aliases: ['et'],
    desc: `Displays the current number of lottery entries.`,

    async execute(client, message, args, isGame) {
        if (!isGame) return;
        const entries = await Entries.find({ tickets: {$gt: 0}});
        
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`:ticket: Current lottery entries: \`${entries.length}\``);
        message.channel.send(`<@${message.author.id}>`, {embed});
    }
};