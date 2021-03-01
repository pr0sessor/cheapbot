const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const config = require('../../../config');

const {sendTransaction} = require('../../../lib/rpc');
const {selectWinner, getJackpotPrize} = require('../../../lib/lottery/core');
const {toFixedFloat} = require('../../../lib/common');

const {Wallets, Entries, Draws} = require('../../../models');

module.exports = {
    group: 'Lottery',
    name: 'draw',
    aliases: ['dw'],
    desc: 'Starts the lottery draw',

    async execute(client, message, args, isGame) {
        if (!isGame) return;
        if (!config.lottery.mods.includes(message.author.id)) return;
        
        
        const entries = await Entries.find({tickets: {$gt: 0}});
        if (entries.length < config.lottery.min) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`:x: The lottery needs \`${config.lottery.min - entries.length}\` entries more to start the draw.`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }
        const winner = selectWinner(entries);
        const jackpot = getJackpotPrize(entries);
        winner.timestamp = moment().unix();
        
        const user = await Wallets.findOne({discord: winner.discord});
        if (user) {
            await Draws.create(winner);
            await Entries.deleteMany({});

            sendTransaction(jackpot, user.address, config.lottery.privateKey, 53000).then(tx => {
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`:moneybag::moneybag::moneybag: You've won \`${toFixedFloat(jackpot, 8)} ${config.network.symbol}\` from the lottery with \`${winner.luck}%\` luck.
                                TX: [${tx.transactionHash}](${config.network.explorer}/tx/${tx.transactionHash})`);
                return message.channel.send(`<@${winner.discord}>`, {embed});
            }).catch(console.log);
        }
        
    }
};