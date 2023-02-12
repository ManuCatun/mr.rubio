const serverSchema = require('../../modelos/servidor.js');
const Discord = require('discord.js');
module.exports = {
    name: "report",
    aliases: ["bug", "report-bug"],
    desc: "Sirve para reportar un bug del bot",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {

            let mensaje = args.join(' ')
            if (!mensaje) return message.reply(`<:nope_normal:1012749750459695114> **| Debes especificar el error!**`)

            let link = message.channel.createInvite({ maxAge: 0, MaxUses: 5 }).then(link => {

                const reporte = new Discord.EmbedBuilder()
                    .setTitle(`<:error:1012451217693221015> | Nuevo error encontrado!`)
                    .addFields([
                        { name: `Reporte:`, value: `${mensaje}` },
                        { name: `Autor:`, value: `\`${message.author.tag}\` • \`${message.author.id}\`` },
                        { name: `Servidor:`, value: `[${message.guild.name}](${link})` },
                    ])
                    .setTimestamp()
                    .setColor('Red')

                client.channels.cache.get("1021250440161148998").send({ embeds: [reporte], content: `<@&995485990049300490>` })

            })

            message.reply(`<:check:1012042903381610496> **| Reporte enviado!**`)

        } catch (e) {
            console.log(e);
            message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setTitle('<:error:1012451217693221015> | Ocurrió un error!')
                        .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                        .setColor('Red')
                        .setFooter({ text: `Por favor utiliza el comando ${schema.prefijo}report-bug para reportar este error!` })
                ]
            })
        }

    }
}