const Discord = require('discord.js');
const { getAverageColor } = require('fast-average-color-node');
const serverSchema = require('../../modelos/servidor.js');
module.exports = {
    name: "icon",
    aliases: ["servericon", "server-icon"],
    desc: "Sirve para ver el icono del servidor",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {

            const color = await getAverageColor(message.guild.iconURL());
            const hexColor = color.hex

            let png = message.guild.iconURL({ format: "png", size: 1024, dynamic: true })
            let jpg = message.guild.iconURL({ format: "jpg", size: 1024, dynamic: true })
            let webp = message.guild.iconURL({ format: "webp", size: 1024, dynamic: true })

            message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`**Icono del servidor ( \`${message.guild.name}\` )**`)
                        .setImage(message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 }))
                        .setFooter({ text: `Solicitado por ${message.author.tag}` })
                        .setTimestamp()
                        .setColor(hexColor)
                ],
                components: [
                    new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder().setStyle('Link').setLabel('PNG').setURL(png),
                        new Discord.ButtonBuilder().setStyle('Link').setLabel('JPG').setURL(jpg),
                        new Discord.ButtonBuilder().setStyle('Link').setLabel('WEBP').setURL(webp),
                    )
                ]
            })

        } catch (e) {
            console.log(e);
            message.reply({ embeds: [
                new Discord.EmbedBuilder()
                .setTitle('<:error:1012451217693221015> | Ocurrió un error!')
                .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                .setColor('Red')
                .setFooter({ text: `Por favor utiliza el comando ${schema.prefijo}report-bug para reportar este error!` })
            ] })
        }

    }
}