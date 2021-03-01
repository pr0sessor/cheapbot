const { MessageEmbed } = require('discord.js');

const config = require('../../config');
const {networkStats} = require('../../lib/rpc');
const {toFixedFloat, convertHash} = require('../../lib/common');

module.exports = {
    group: 'Utils',
    name: 'calculate',
    aliases: ['cal'],
    desc: 'Displays estimated mining reward by hashrate',

    async execute(client, message, args, isGame) {
        if (isGame) return;
        if (args.length !== 1) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(':x: Incorrect syntax.')
            .setDescription(`Use \`${config.prefix}calculate <hash rate>\` (you can append K, M, G, T, P at the end to avoid putting many zeros. ex: 1k or 1K will be read as 1000)`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }
        const multiplier = {
            "k": 1E3,
            "m": 1E6,
            "g": 1E9,
            "t": 1E12,
            "p": 1E15
        };
        let hash = parseFloat(args[0]);
        let symbol = args[0].substr(-1).toLowerCase();
        if (Object.keys(multiplier).includes(symbol)){
            hash *= multiplier[symbol];
        }
        const network = await networkStats();
        const hour = toFixedFloat((60 / ((network.difficulty / hash) / 60))  * 2, 8),
              day = toFixedFloat((1440 / ((network.difficulty / hash) / 60))  * 2, 8),
              week = toFixedFloat((10080 / ((network.difficulty / hash) / 60))  * 2, 8),
              month = toFixedFloat((43.2E3 / ((network.difficulty / hash) / 60))  * 2, 8),
              year = toFixedFloat((525.6E3 / ((network.difficulty / hash) / 60))  * 2, 8);

        const embed = new MessageEmbed()
        .setTitle(`Estimated ${config.network.name} mining reward`)
        .setColor('RANDOM')
        .addField('Hashrate', `\`${convertHash(hash)}/s\``, true)
        .addField('Hourly', `\`${hour}\``, true)
        .addField('Daily', `\`${day}\``, true)
        .addField('Weekly', `\`${week}\``, true)
        .addField('Monthly', `\`${month}\``, true)
        .addField('Yearly', `\`${year}\``, true);
        message.channel.send({ embed });

    }
};