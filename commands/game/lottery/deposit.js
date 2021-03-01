const { MessageEmbed } = require('discord.js');

const config = require('../../../config');

const {Wallets} = require('../../../models');

module.exports = {
    group: 'Lottery',
    name: 'deposit',
    aliases: ['dp'],
    desc: `Displays deposit address.`,

    async execute(client, message, args, isGame) {
        if (!isGame) return;
        const user = await Wallets.findOne({discord: message.author.id});
        if (!user) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: You don't have a lottery account yet. To join, use \`${config.gamePrefix}join\` command`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`:bank: Your deposit address: \`${user.address}\``);
        message.author.send(`<@${message.author.id}>`, {embed});
    }
};