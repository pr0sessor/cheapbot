const { MessageEmbed } = require('discord.js');

const config = require('../../config');
const {getMarket, getPrice, toFixedFloat} = require('../../lib/common');

module.exports = {
    group: 'Utils',
    name: 'convert',
    aliases: ['cnv'],
    desc: `Displays estimated value of ${config.network.symbol} to other currency`,

    async execute(client, message, args, isGame) {
        if (isGame) return;
        if (args.length !== 1) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(':x: Incorrect syntax.')
            .setDescription(`Use \`${config.prefix}convert <amount>\` (you can append K, M, G, T, P at the end to avoid putting many zeros. ex: 1k or 1K will be read as 1000)`);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }
        const multiplier = {
            "k": 1E3,
            "m": 1E6,
            "g": 1E9,
            "t": 1E12,
            "p": 1E15
        };
        let amount = parseFloat(args[0]);
        let symbol = args[0].substr(-1).toLowerCase();
        if (Object.keys(multiplier).includes(symbol)){
            amount *= multiplier[symbol];
        }

        const market = await getMarket();
        const price = await getPrice();
        const eth = amount * market.last_price;

        const embed = new MessageEmbed()
        .setTitle(`Estimated value of ${amount} ${config.network.symbol}`)
        .setColor('RANDOM')
        .addField('ETH', `\`${toFixedFloat(eth, 8)}\``, true)
        .addField('BTC', `\`${toFixedFloat(eth * price.BTC, 8)}\``, true)
        .addField('USD', `\`${toFixedFloat(eth * price.USD, 4)}\``, true)
        .addField('GBP', `\`${toFixedFloat(eth * price.GBP, 4)}\``, true)
        .addField('EUR', `\`${toFixedFloat(eth * price.EUR, 4)}\``, true)
        .addField('CAD', `\`${toFixedFloat(eth * price.CAD, 4)}\``, true);
        message.channel.send({ embed });

    }
};