const serverSchema = require('../../modelos/servidor.js');
const Discord = require('discord.js');
module.exports = {
    name: "say",
    aliases: ["decir", "repetir"],
    desc: "El bot repetirá lo que le digas",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {

            const texto = args.join(" ")
            if(!texto) return message.reply(`<:nope_normal:1012749750459695114> **| Debes escribir un texto!**`)

            if(texto) {
                message.channel.sendTyping()
                setTimeout(() => message.channel.send(`${texto}`), 500 )
            }


        } catch(e) {
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