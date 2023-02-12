const Discord = require('discord.js');
module.exports = {
    name: "lock",
    aliases: ["cerrar", "lock-channel", "cerrar-canal"],
    desc: "Sirve para cerrar un canal",
    permisos_bot: ["ManageChannels"],
    permisos: ["ManageChannels"],

    run: async (client, message, args, prefix) => {

        const razon = args.join(' ') || "No especificado";
        
        message.channel.permissionOverwrites.edit(message.guild.roles.cache.find(e => e.name.toLowerCase().trim() === "@everyone"), {
            SendMessages: false,
          });

        message.reply({ embeds: [
            new Discord.EmbedBuilder()
            .setTitle('🔒 | Canal Cerrado')
            .addFields([
                { name: `Razón:`, value: `${razon}` }
            ])
            .setColor('Red')
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }) })
        ] })  

    }
}