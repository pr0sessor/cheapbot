const { MessageEmbed } = require('discord.js');

const config = require('../../config');
const {validateAddress} = require('../../lib/rpc');
const pools = require('../../pools.json');

const {Users} = require('../../models');

module.exports = {
    group: 'Pool',
    name: 'pooldel',
    aliases: ['pd'],
    desc: `Deletes your ${config.network.name} address and pool`,

    execute(client, message, args, isGame) {
        if (isGame) return;

        Users.findOne({discord: message.author.id}, (err, user) => {
            if (err) return console.log(err);

            if (!user) {
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(':x: You don\'t have records to delete.');
                return message.channel.send(`<@${message.author.id}>`, {embed});
            }
    
            Users.deleteOne({discord: message.author.id}, (err2) => {
                if (err2) return console.log(err2)
    
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`:white_check_mark: Your records were deleted.`);
                message.channel.send(`<@${message.author.id}>`, {embed});
            });
        });
    }
};