const Discord = require('discord.js');
const setupSchema = require(`../../modelos/setups.js`);

module.exports = {
    name: "setup-confessions",
    aliases: ["canal-confesiones", "setup-confesiones"],
    desc: "Sirve para definir el canal del sistema de Confesiones",
    permisos_bot: ["ManageChannels"],
    permisos: ["ManageChannels"],
 
    run: async (client, message, args, prefix) => {

        if(!args.length) return message.reply(`<:nope_normal:1012749750459695114> **| Tienes que especificar el canal de confesiones!**`)
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first();
        if(!channel || channel.type !== 0) return message.reply(`<:nope_normal:1012749750459695114> **| No he encontrado el canal que has especificado!**`);

        await setupSchema.findOneAndUpdate({ guildID: message.guild.id }, {
            confesiones: channel.id
        })

        return message.reply({ embeds: [
            new Discord.EmbedBuilder()
            .setTitle(`<:check:1012042903381610496> **| Se ha establecido el canal de Confesiones en \`${channel.name}\`**`)
            .setDescription(`*Cada vez que una persona envíe un mensaje en ${channel}, lo convertiré en una confesión!*`)
            .setColor(client.color)
        ] })

    }
}