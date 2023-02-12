const Discord = require('discord.js');
const setupSchema = require('../../modelos/setups.js');
module.exports = {
    name: "setup-welcomes",
    aliases: ["canal-bienvenidas", "bienvenidas"],
    desc: "Sirve para definir el canal de bienvenidas",
    permisos_bot: [],
    permisos: ["ManageChannels"],

    run: async (client, message, args, prefix) => {

        try {

            if (!args.length) return message.reply(`<:nope_normal:1012749750459695114> **| Tienes que especificar el canal de bienvenidas!**`)
            const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
            if (!channel || channel.type !== 0) return message.reply(`<:nope_normal:1012749750459695114> **| No he encontrado el canal que has especificado!**`);
            const img = args[1];
            if (!img) return message.reply(`<:nope_normal:1012749750459695114> **| Tienes que especificar una imagen de bienvenidas!**`)

            await setupSchema.findOneAndUpdate({ guildID: message.guild.id }, {
                bienvenidas: {
                    canal: channel.id,
                    imagen: img
                } 
            })

            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`<:check:1012042903381610496> **| Sistema de Bienvenidas activado!**`)
                        .setDescription(`Las notificaciones se enviarán a ${channel}`)
                        .setFooter({ text: `Sistema de Bienvenidas | Powered by ${client.user.username}` })
                        .setColor(client.color)
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