const { MessageEmbed } = require('discord.js');
const timeAgo = require('node-time-ago');

const config = require('../../config');
const pools = require('../../pools.json');
const {getPoolStats, convertHash} = require('../../lib/common');

module.exports = {
    group: 'Pool',
    name: 'pools',
    aliases: ['pl'],
    desc: `Displays list of ${config.network.name} pools`,

    async execute(client, message, args, isGame) {
        if (isGame) return;
        pools.forEach(async (pool, i) => {
            const url = `${(pool.ssl ? 'https://' : 'http://')}${pool.domain}/`;
            const stats = await getPoolStats(url);

            const embed = new MessageEmbed()
            .setTitle(pool.name)
            .setColor('RANDOM')
            .addFields(
                {name: 'ID', value: `\`${i+1}\``, inline: true},
                {name: 'Stratum', value: `\`${pool.stratum}\``, inline: true},
                {name: 'Miners', value: `\`${stats.minersTotal}\``, inline: true},
                {name: 'Hashrate', value: `\`${convertHash(stats.hashrate)}/s\``, inline: true},
                {name: 'Last Block Found', value: `\`${timeAgo(stats.stats.lastBlockFound * 1000)}\``, inline: true},
                {name: 'Website', value: `[${url}](${url})`, inline: true}
            );
            message.channel.send({embed});
        });
    }        
};