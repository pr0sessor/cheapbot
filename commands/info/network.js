const { MessageEmbed } = require('discord.js');

const config = require('../../config');
const {networkStats} = require('../../lib/rpc');
const {convertHash} = require('../../lib/common');

module.exports = {
    group: 'Info',
    name: 'network',
    aliases: ['net'],
    desc: `Displays current ${config.network.name} network stats`,

    async execute(client, message, args, isGame) {
        if (isGame) return;
        const network = await networkStats();
        const embed = new MessageEmbed()
        .setTitle(`${config.network.name} Network Stats`)
        .setColor('RANDOM')
        .addField('Height', `\`${network.blockNumber}\``, true)
        .addField('Difficulty', `\`${convertHash(network.difficulty)}\``, true)
        .addField('Hashrate', `\`${network.hashrate}\``, true);
        message.channel.send({ embed });
    }
};