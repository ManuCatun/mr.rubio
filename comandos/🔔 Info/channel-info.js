const Discord = require('discord.js');
module.exports = {
    name: "channel-info",
    aliases: ["ch-info", "channelinfo", "info-canal", "infocanal"],
    desc: "Sirve para ver la información de un canal",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        try {

            const canal = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first() || message.channel;

            let canalType;
            if (canal.type === 0) canalType = "Texto";
            if (canal.type === 2) canalType = "Voz";

            let categoria;
            if (canal.parent) {
                categoria = canal.parent.id
            } else {
                categoria = "Ninguna"
            }

            message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setDescription(`**Información del canal <#${canal.id}>**`)
                        .addFields([
                            { name: `Nombre`, value: `\`${canal.name}\`` },
                            { name: `ID`, value: `\`${canal.id}\`` },
                            { name: `Creación`, value: `<t:${parseInt(canal.createdTimestamp / 1000)}:f> (<t:${parseInt(canal.createdTimestamp / 1000)}:R>)` },
                            { name: `Tipo de Canal`, value: `\`${canalType}\`` },
                            { name: `¿Canal NSFW?`, value: `\`${canal.nsfw ? "Si" : "No"}\`` },
                            { name: `Categoría`, value: `<#${categoria}>` },
                        ])
                        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                        .setColor(client.color)
                        .setTimestamp()
                ]
            })

        } catch (e) {
            console.log(e);
            message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('<:error:1012451217693221015> | Ocurrió un error!')
                        .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                        .setColor('Red')
                        .setFooter({ text: `Por favor utiliza el comando ${prefix}report-bug para reportar este error!` })
                ]
            })
        }

    }
}