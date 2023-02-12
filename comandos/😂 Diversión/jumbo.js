const serverSchema = require('../../modelos/servidor.js');
const Discord = require('discord.js');
module.exports = {
    name: "jumbo",
    aliases: ["emoji", "emoji-png"],
    desc: "El bot te enviará un emoji del servidor como png",
    permisos_bot: ["ManageEmojis"],
    permisos: [],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {

            if (!args[0]) return message.reply(`<:nope_normal:1012749750459695114> **| Debes añadir un emoji!**`);

            let emoji = message.guild.emojis.cache.find(a => a.name === args[0].split(":")[1])
            if (!emoji) return message.channel.send("<:nope_normal:1012749750459695114> **| No pude encontrar ese emoji!**")

            message.reply({ embeds: [
                new Discord.EmbedBuilder()
                .setTitle(`${emoji.name}`)
                .setDescription(`\`<${emoji.name}:${emoji.id}>\``)
                .setImage(emoji.url)
                .setColor(client.color)
            ] })

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