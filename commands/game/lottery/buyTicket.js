const { MessageEmbed } = require('discord.js');
const util = require('util');

const config = require('../../../config');
const {getBalance, toWei, sendTransaction, getGasLimit} = require('../../../lib/rpc');
const { toFixedFloat } = require('../../../lib/common');
const {decrypt} = require('../../../lib/crypto');

const {Wallets,Entries} = require('../../../models');

module.exports = {
    group: 'Lottery',
    name: 'buy',
    aliases: ['bt'],
    desc: 'Buy lottery tickets.',

    async execute(client, message, args, isGame) {
        if (!isGame) return;
        const user = await Wallets.findOne({discord: message.author.id});
        if (!user) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: You don't have a lottery account yet. To join, use \`${config.gamePrefix}join\` command`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }            
        let qty = parseInt(args[0]);
        if (args.length == 0) qty = 1;

        if (qty <= 0) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: Ticket quantity should be more than zero`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }

        const entry = await Entries.findOne({discord: message.author.id});
        let total = qty;        

        const balance = await getBalance(user.address);
        const gasLimit = await getGasLimit();
        const price = qty * config.lottery.price;
        const fee = toFixedFloat(toWei(config.lottery.gas, 'Gwei') *  gasLimit / toWei(1, 'ether'), 8);
        const amount = price + fee;

        if ((balance/ toWei(1, 'ether')) < amount) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: You need more \`${toFixedFloat(amount - (balance/ toWei(1, 'ether')), 8)} ${config.network.symbol}\` to buy \`${qty}\` lottery tickets.
                            Lottery ticket price: \`${config.lottery.price} ${config.network.symbol}\`
                            Lottery account balance: \`${toFixedFloat(balance/ toWei(1, 'ether'), 8)} ${config.network.symbol}\``);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }

        sendTransaction(price, config.lottery.address, decrypt(user.privateKey)).then(async(tx) => { 
            if (!entry) {
                await Entries.create({discord: message.author.id, tickets: qty});
            } else {
                total += entry.tickets;
                await Entries.updateOne({discord: message.author.id}, {tickets: total});
            }
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:white_check_mark: You've successfully bought \`${qty}\` lottery tickets for \`${toFixedFloat(price, 8)} ${config.network.symbol}\`. You now have a total of \`${total}\` lottery tickets for the next draw.
                            TX: [${tx.transactionHash}](${config.network.explorer}/tx/${tx.transactionHash})`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }).catch(console.log);
    }
};