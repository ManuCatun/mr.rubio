const ms = require('ms');
const serverSchema = require('../../modelos/servidor.js');
const Discord = require('discord.js');
module.exports = {
    name: "slowmode",
    aliases: ["modolento", "modo-lento", "modo-pausado"],
    desc: "Sirve para poner un canal en modo lento",
    permisos_bot: ["ManageChannels"],
    permisos: ["ManageChannels"],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {

            const tiempo = args[0]
            if(tiempo === "off") {
                message.channel.setRateLimitPerUser(0);
                return message.reply(`${message.channel} ya no está en modo pausado!`)
            }

            if(!tiempo) return message.reply(`<:nope_normal:1012749750459695114> **| Debes escribir un número para poner el modo pausado en esa cantidad de segundos! \nO escribir "off" para desactivarlo**`)

            await message.channel.setRateLimitPerUser(tiempo)
            message.reply(`<:slowmode:991921425080393728> | ${message.channel} ahora está en modo pausado! \nLos usuarios solo podrán un mensaje cada **${tiempo} segundos**`)

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