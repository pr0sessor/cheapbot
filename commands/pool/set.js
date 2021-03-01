const { MessageEmbed } = require('discord.js');

const config = require('../../config');
const {validateAddress} = require('../../lib/rpc');
const pools = require('../../pools.json');

const {Users} = require('../../models');

module.exports = {
    group: 'Pool',
    name: 'poolset',
    aliases: ['ps'],
    desc: `Set your ${config.network.name} address and pool for stats tracking`,

    execute(client, message, args, isGame) {
        if (isGame) return;
        if (message.channel.type === 'text') message.delete();
        if (args.length != 2) {
            const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(':x: Incorrect syntax.')
            .setDescription(`Use \`${config.prefix}poolset <${config.network.name} address> <Pool ID from ${config.prefix}pools command>\``);
            return message.channel.send(`<@${message.author.id}>`, {embed});
        }

        Users.findOne({discord: message.author.id}, (err, user) => {
            if (err) return console.log(err);

            if (user) {
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`:x: You already have an existing ${config.network.name} address. To update your records, please use \`${config.prefix}poolupdate\` command.`);
                return message.channel.send(`<@${message.author.id}>`, {embed});
            }

            if (!validateAddress(args[0])) {
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`:x: Invalid ${config.network.name} address.`)
                return message.channel.send(`<@${message.author.id}>`, {embed});
            }
    
            if (args[1] <= 0 || args[1] > pools.length-1) {
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(':x: Invalid Pool ID.')
                return message.channel.send(`<@${message.author.id}>`, {embed});
            }
    
            Users.create({discord: message.author.id, address: args[0], pool: pools[parseInt(args[1])-1]}, (err2) => {
                if (err2) return console.log(err2)
    
                const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`:white_check_mark: Your records were saved.`);
                message.channel.send(`<@${message.author.id}>`, {embed});
            });
        });
    }
};