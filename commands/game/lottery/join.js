const { MessageEmbed } = require('discord.js');

const config = require('../../../config');
const {createWallet, getLatestBlock, getTransaction, getConfirmations} = require('../../../lib/rpc');
const {encrypt} = require('../../../lib/crypto');

const {Wallets} = require('../../../models');

module.exports = {
    group: 'Lottery',
    name: 'join',
    aliases: ['jn'],
    desc: 'Creates a lottery account',

    async execute(client, message, args, isGame) {
        if (!isGame) return;
        const user = await Wallets.findOne({discord: message.author.id});
        if (user) {
            if (user.status == 2) {
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`:x: You alreay have a lottery account.`);
                return message.channel.send(`<@${message.author.id}>`, {embed});
            } /*else if (user.status == 1) {
                const tx = await getTransaction(user.hash);
                const confirmations = await getConfirmations(tx.blockNumber);
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`:clock4: We've received your deposit! We're just waiting for ${confirmations} confirmations.`);
                return message.channel.send(`<@${message.author.id}>`, {embed});
            } else {
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`:bank: Please deposit at least \`${config.lottery.join}\` ${config.network.symbol} to this: \`${user.address}\``);
                return message.author.send(`<@${message.author.id}>`, {embed});
            }*/
        }

        const keyPair = createWallet();
        const latestBlock = await getLatestBlock();
        const insert = await Wallets.create({discord: message.author.id, address: keyPair.address, privateKey: encrypt(keyPair.privateKey), status: 0, block: latestBlock.number});
        if (!insert) return console.log(insert);
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`:bank: Your deposit deposit address: \`${keyPair.address}\``);
        return message.author.send(`<@${message.author.id}>`, {embed});
    }
};