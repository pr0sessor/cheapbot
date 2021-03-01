const { MessageEmbed } = require('discord.js');

const config = require('../../../config');
const {getBalance} = require('../../../lib/rpc');
const {toFixedFloat} = require('../../../lib/common');

const {Wallets} = require('../../../models');

module.exports = {
    group: 'Lottery',
    name: 'lotbal',
    aliases: ['lbal'],
    desc: `Displays the current balance of your lottery account`,

    async execute(client, message, args, isGame) {
        if (!isGame) return;
        const user = await Wallets.findOne({discord: message.author.id});
        if (!user) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: You don't have a lottery account yet. To join, use \`${config.gamePrefix}join\` command`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }

        const balance = await getBalance(user.address);
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`:moneybag: Current lottery account balance: \`${toFixedFloat((balance/ 1000000000000000000), 8)} ${config.network.symbol}\``);
        message.channel.send(`<@${message.author.id}>`, {embed});
    }
};