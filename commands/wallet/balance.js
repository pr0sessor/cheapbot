const { MessageEmbed } = require('discord.js');

const config = require('../../config');
const {validateAddress, getBalance} = require('../../lib/rpc');
const {toFixedFloat} = require('../../lib/common');

module.exports = {
    group: 'Wallet',
    name: 'balance',
    aliases: ['bal'],
    desc: `Displays the current balance of an address`,

    async execute(client, message, args, isGame) {
        if (isGame) return;
        if (message.channel.type === 'text') message.delete();
        if (args.length !== 1) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(':x: Incorrect syntax.')
            .setDescription(`Use \`${config.prefix}balance <${config.network.name} address>\``);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }

        if (!validateAddress(args[0])) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: Invalid ${config.network.name} address.`)
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }
        const balance = await getBalance(args[0]);
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`:moneybag: Current balance: \`${toFixedFloat((balance/ 1000000000000000000), 8)} ${config.network.symbol}\``);
        message.channel.send(`<@${message.author.id}>`, {embed});
    }
};