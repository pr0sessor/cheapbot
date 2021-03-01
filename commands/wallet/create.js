const { MessageEmbed } = require('discord.js');

const config = require('../../config');
const rpc = require('../../lib/rpc');

module.exports = {
    group: 'Wallet',
    name: 'createwallet',
    aliases: ['cw'],
    desc: `Creates a ${config.network.name} wallet`,

    execute(client, message, args, isGame) {
        if (isGame) return;
        const keyPair = rpc.createWallet();  
        const embed = new MessageEmbed()
        .setTitle(`Your ${config.network.name} Wallet`)
        .setColor('RANDOM')
        .addField('Address', `${keyPair.address}`, false)
        .addField('Private Key', `${keyPair.privateKey}`, false)
        .setFooter('PLEASE BACK UP YOUR PRIVATE KEY!! This message be DELETED after 30 seconds.');
        message.author.send({ embed }).then(m => m.delete({timeout:30000}));
    }
};