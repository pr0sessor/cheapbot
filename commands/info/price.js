const { MessageEmbed } = require('discord.js');

const config = require('../../config');
const {getMarket, getPrice, toFixedFloat} = require('../../lib/common');

module.exports = {
    group: 'Info',
    name: 'market',
    aliases: ['mk'],
    desc: `Displays current ${config.network.name} market info`,

    async execute(client, message, args, isGame) {
        if (isGame) return;
        const market = await getMarket();
        const price = await getPrice();

        const embed = new MessageEmbed()
        .setTitle(`${config.network.name} Market Info (CTH-ETH)`)
        .setColor('RANDOM')
        .addField('Bid', `\`${market.bid}\``, true)
        .addField('Ask', `\`${market.ask}\``, true)
        .addField('High', `\`${market.high}\``, true)
        .addField('Low', `\`${market.low}\``, true)
        .addField('Volume', `\`${market.target_volume}\``, true)
        .addField('Last Price', `\`${market.last_price}\``, true)
        .addField('BTC', `\`${toFixedFloat(market.last_price * price.BTC, 8)}\``, true)
        .addField('USD', `\`$${toFixedFloat(market.last_price * price.USD, 4)}\``, true)
        .addField('EUR', `\`$${toFixedFloat(market.last_price * price.EUR, 4)}\``, true);
        message.channel.send({ embed });
    }
};