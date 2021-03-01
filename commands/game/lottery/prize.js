const { MessageEmbed } = require('discord.js');

const config = require('../../../config');
const {getJackpotPrize} = require('../../../lib/lottery/core');
const {toFixedFloat} = require('../../../lib/common');

const {Entries} = require('../../../models');

module.exports = {
    group: 'Lottery',
    name: 'jackpot',
    aliases: ['jp'],
    desc: `Displays the current jackpot prize.`,

    async execute(client, message, args, isGame) {
        if (!isGame) return;
        const entries = await Entries.find({ tickets: {$gt: 0}});
        
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`:moneybag::moneybag::moneybag: Current jackpot prize: \`${toFixedFloat(getJackpotPrize(entries), 8)} ${config.network.symbol}\``);
        message.channel.send(`<@${message.author.id}>`, {embed});
    }
};