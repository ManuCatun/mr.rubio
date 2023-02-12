const Discord = require('discord.js');
const setupSchema = require('../../modelos/setups.js');
module.exports = {
    name: "setup-rank",
    aliases: ["setup-ranking", "setup-niveles", "canal-niveles", "setup-levels"],
    desc: "Sirve para activar el sistema de niveles",
    permisos_bot: [],
    permisos: ["ManageChannels"],

    run: async (client, message, args, prefix) => {

        try {

            const canalNotificaciones = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
            if (!canalNotificaciones) return message.reply(`<:nope_normal:1012749750459695114> **| Debes especificar un canal de notificaciones al subir de nivel!**`);
            const mensaje = args.slice(1).join(" ").substring(0, 2048);
            if (!mensaje) return message.reply(`<:nope_normal:1012749750459695114> **| Debes especificar un mensaje al subir de nivel!**`);

            await setupSchema.findOneAndUpdate({ guildID: message.guild.id }, {
                niveles: {
                    canal: canalNotificaciones.id,
                    mensaje
                }
            })

            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle(`<:check:1012042903381610496> **| Sistema de Niveles activado!**`)
                        .setDescription(`Las notificaciones se enviarán a ${canalNotificaciones}`)
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