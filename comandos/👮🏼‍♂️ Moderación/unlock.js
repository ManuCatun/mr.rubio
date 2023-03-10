const Discord = require('discord.js');
module.exports = {
    name: "unlock",
    aliases: ["abrir", "unlock-channel", "abrir-canal"],
    desc: "Sirve para abrir un canal que fue cerrado anteriormente",
    permisos_bot: ["ManageChannels"],
    permisos: ["ManageChannels"],

    run: async (client, message, args, prefix) => {
        
        message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() === "@everyone"), {
            SendMessages: true,
          });

        message.reply({ embeds: [
            new Discord.EmbedBuilder()
            .setTitle('🔓 | Canal Abierto')
            .setColor('Green')
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) })
        ] })  

    }
}