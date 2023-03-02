const Discord = require('discord.js');
const { getAverageColor } = require('fast-average-color-node');
const serverSchema = require('../../modelos/servidor.js');
module.exports = {
    name: "avatar",
    aliases: ["pfp", "perfil"],
    desc: "Sirve para ver el avatar de un usuario",
    permisos_bot: ["EmbedLinks"],
    permisos: [],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {

            const usuario = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member

            const color = await getAverageColor(usuario.user.avatarURL());
            const hexColor = color.hex;

            let png = usuario.user.AvatarURL({ format: "png", size: 1024, dynamic: true })
            let jpg = usuario.user.AvatarURL({ format: "jpg", size: 1024, dynamic: true })
            let webp = usuario.user.AvatarURL({ format: "webp", size: 1024, dynamic: true })

            message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`Avatar de ${usuario.user.tag}`)
                        .setImage(usuario.user.displayAvatarURL({ format: "png", size: 1024, dynamic: true }))
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