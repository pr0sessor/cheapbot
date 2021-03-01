const { MessageEmbed } = require('discord.js');
const timeAgo = require('node-time-ago');

const config = require('../../config');
const {getAddressStats, convertHash, toFixedFloat} = require('../../lib/common');

const {Users} = require('../../models');

module.exports = {
    group: 'Pool',
    name: 'poolstats',
    aliases: ['pt'],
    desc: 'Displays your stats on the pool you set',

    execute(client, message, args, isGame) {
        if (isGame) return; 
        Users.findOne({discord: message.author.id}, async(err, user) => {
            if (err) return console.log(err);

            if (!user) {
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`:x: You didn't set your ${config.network.name} address and pool yet. To set your records, please use \`${config.prefix}poolset\` command.`);
                return message.channel.send(`<@${message.author.id}>`, {embed});
            }

            const stats = await getAddressStats(user.address, `${(user.pool.ssl ? 'https://' : 'http://')}${user.pool.api}/`);
            if (!stats) return;
            const embed = new MessageEmbed()
            .setTitle(`Your ${user.pool.domain} Stats`)
            .setColor('RANDOM')
            .addFields(
                {name: 'Immature Balance', value: `\`${toFixedFloat(stats.stats.immature/1000000000, 8)}\``, inline: true},
                {name: 'Pending Balance',  value: `\`${toFixedFloat(stats.stats.balance/1000000000, 8)}\``, inline: true},
                {name: 'Total Paid',  value: `\`${toFixedFloat(stats.stats.paid/1000000000, 8)}\``, inline: true},
                {name: 'Total Payments',  value: `\`${stats.paymentsTotal}\``, inline: true},
                {name: 'Blocks Found',  value: `\`${stats.stats.blocksFound}\``, inline: true},
                {name: 'Last Share Submitted',  value: `\`${timeAgo(stats.stats.lastShare * 1000)}\``, inline: true},
                {name: 'Hashrate (30m)', value: `\`${convertHash(stats.currentHashrate)}/s\``, inline: true},
                {name: 'Hashrate (3h)',  value: `\`${convertHash(stats.hashrate)}/s\``, inline: true},
                {name: 'Workers Online',  value: `\`${stats.workersOnline}\``, inline: true}
            );
            message.channel.send(`<@${message.author.id}>`, { embed });
        })
    }
};