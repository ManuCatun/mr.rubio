const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: "members",
    aliases: ["member-count", "miembros", "conteo-miembros", "usuarios"],
    desc: "Sirve para ver la cantidad de miembros dentro del servidor",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Cantidad de Usuarios en \`${message.guild.name}\``)
                    .addFields([
                        { name: "👥 Total: ", value: `${message.guild.memberCount} usuarios` },
                        { name: "👤 Humanos: ", value: `${message.guild.members.cache.filter(usuario => !usuario.user.bot).size} humanos`, },
                        { name: "🤖 Bots: ", value: `${message.guild.members.cache.filter(bot => bot.user.bot).size} bots`, }
                    ])
                    .setColor(client.color)
                    .setThumbnail(message.guild.iconURL({ size: 4096, dynamic: true }))
                    .setTimestamp()
            ]
        })

    }
}