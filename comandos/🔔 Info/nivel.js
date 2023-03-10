const Discord = require('discord.js');
const Levels = require('discord-xp');
const setupSchema = require('../../modelos/setups.js');
module.exports = {
    name: "nivel",
    aliases: ["rank", "level"],
    desc: "Sirve para ver tu nivel",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        try {

            let setupData = await setupSchema.findOne({ guildID: message.guild.id });
            if (!setupData.niveles || !setupData.niveles.mensaje || !message.guild.channels.cache.get(setupData.niveles.canal)) return message.reply(`<:nope_normal:1012749750459695114> **| El sistema de Niveles no esta activado en este servidor!**`)

            const usuario = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

            const user = await Levels.fetch(usuario.user.id, message.guild.id);
            if (!user.level) return message.reply(`<:nope_normal:1012749750459695114> **| Este usuario no tiene nivel!**`)

            const XpNecesaria = await Levels.xpFor(user.level + 1);

            message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle(`Nivel de ${usuario.user.tag}`)
                    .setDescription(`**Eres nivel \`${user.level}\`** \nNecesitas \`${XpNecesaria - user.xp}xp\` para llegar al siguiente nivel!`)
                    .setColor(client.color)
                    .setFooter({ text: `Sistema de Niveles | Powered by ${client.user.tag}` })
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