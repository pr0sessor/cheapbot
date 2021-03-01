const { MessageEmbed } = require('discord.js');

const config = require('../../config');

module.exports = {
    group: 'Info',
    name: 'about',
    aliases: ['info'],
    desc: 'Displays info of the bot',

    execute(client, message, args, isGame) {
        if (isGame) return;
        const embed = new MessageEmbed()
        .setTitle('About')
        .setColor('RANDOM')
        .setDescription(`A bot created by pr0sessor for ${config.network.name} community.`)
        .addField('Donation Address', 'CTH: `0x0051bfA2437356007C499fb250B9BE3483C87642`', true);
        message.channel.send({ embed });
    }
};