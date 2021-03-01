const { MessageEmbed } = require('discord.js');

const config = require('../../../config');
const { toFixedFloat } = require('../../../lib/common');
const {validateAddress, getBalance, sendTransaction, toWei, getGasLimit} = require('../../../lib/rpc');
const {decrypt} = require('../../../lib/crypto');

const {Wallets} = require('../../../models');

module.exports = {
    group: 'Lottery',
    name: 'withdraw',
    aliases: ['wd'],
    desc: `Withdraw your lottery earnings.`,

    async execute(client, message, args, isGame) {
        if (!isGame) return;
        if (message.channel.type === 'text') message.delete();
        const user = await Wallets.findOne({discord: message.author.id});
        if (!user) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: You don't have a lottery account yet. To join, use \`${config.gamePrefix}join\` command`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }
        if (args.length !== 2) {            
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(':x: Incorrect syntax.')
            .setDescription(`Use \`${config.prefix}withraw <${config.network.name} address> <amount>\`.`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }

        if (!validateAddress(args[0])) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: Invalid ${config.network.name} address.`)
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }

        const balance = await getBalance(user.address);
        const gasLimit = await getGasLimit();
        let amount = parseFloat(args[1]);
        const fee = toFixedFloat(toWei(config.lottery.gas, 'Gwei') *  gasLimit / toWei(1, 'ether'), 8);
        amount += fee;

        if ((balance/ toWei(1, 'ether')) < amount) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: You're trying to withdraw \`${toFixedFloat(amount, 8)} ${config.network.symbol}\` when you only have \`${toFixedFloat((balance/ toWei(1, 'ether')), 8)} ${config.network.symbol}\``);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }

        if (amount <= 0) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: Amount should be more than zero`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }

        sendTransaction(amount, args[0], decrypt(user.privateKey)).then(tx => {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:moneybag::moneybag::moneybag: Successfully sent \`${toFixedFloat(amount-fee, 8)} ${config.network.symbol}\` to \`${args[0]}\`.
                            TX: [${tx.transactionHash}](${config.network.explorer}/tx/${tx.transactionHash})`);
            return message.author.send(`<@${message.author.id}>`, {embed});
        }).catch(console.log);
    }
};