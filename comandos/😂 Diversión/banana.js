const serverSchema = require('../../modelos/servidor.js');
const Discord = require('discord.js');
module.exports = {
    name: "banana",
    aliases: ["pepino"],
    desc: "Sirve para ver cuanto mide la banana de un usuario",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {

            const num = Math.floor(Math.random() * 25) + 1; 

            const usuario = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

            message.reply(`🍌 | La banana de **${usuario.user.username}** mide **${num} centímetros**`)

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