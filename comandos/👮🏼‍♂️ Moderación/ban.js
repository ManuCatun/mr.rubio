const Discord = require('discord.js')
module.exports = {
    name: "ban",
    aliases: ["banear", "vetar"],
    desc: "Sirve para banear a un usuario del servidor",
    permisos: ["BanMembers"],
    permisos_bot: ["BanMembers"],

    run: async (client, message, args, prefix) => {

        //Definimos la persona a banear
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(`<:nope_normal:1012749750459695114> **| No se ha encontrado el usuario que has especificado!**`)
        let razon = args.slice(1).join(" ") || "No especificado"

        //Comprobar roles del bot
        if (message.guild.members.me.roles.highest.position > usuario.roles.highest.position) {
            
            //Comprobar posiciones de los roles
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                //Enviamos un embed al usuario
                usuario.send({ embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle(`Has sido baneado de __${message.guild.name}__`)
                    .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                    .setColor(client.color)
                    .setTimestamp()
                ] }).catch(() => { message.reply(`<:error:1012451217693221015> **| No he podido enviarle el mensaje al usuario!**`)});
                
                //enviamos un embed al canal
                message.reply({ embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle(`<:check:1012042903381610496> **| Usuario baneado!**`)
                    .setDescription(`Se ha baneado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)* del servidor`)
                    .addFields([ { name: 'Razón', value: `\n\`\`\`yml\n${razon}\`\`\``} ])
                    .setColor(client.color)
                    .setTimestamp()
                ] })

                usuario.ban({ reason: razon })
            } else {
                return message.reply(`<:nope_normal:1012749750459695114> **| Tu rol está por __debajo__ del usuario que quieres banear!**`)
            }
        } else {
            return message.reply(`<:nope_normal:1012749750459695114> **| Mi rol está por __debajo__ del usuario que quieres banear!**`)
        }

    }
}