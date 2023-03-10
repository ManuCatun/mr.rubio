const { asegurar_todo } = require('../../utils/funciones.js');
const Discord = require('discord.js');
const warnSchema = require('../../modelos/warns.js')
module.exports = {
    name: "warn",
    aliases: ["warnear", "avisar", "advertir"],
    desc: "Sirve para enviar un aviso a un usuario del servidor",
    permisos: ["ManageChannels"],
    permisos_bot: ["ManageChannels"],

    run: async (client, message, args, prefix) => {

        //Definimos la persona a banear
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(`<:nope_normal:1012749750459695114> **| No se ha encontrado el usuario que has especificado!**`);
        await asegurar_todo(message.guild.id, usuario.id);
        let razon = args.slice(1).join(" ") || "No especificado"

        //Comprobar roles del bot
        if (message.guild.members.me.roles.highest.position > usuario.roles.highest.position) {
            
            //Comprobar posiciones de los roles
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                //Enviamos un embed al usuario
                usuario.send({ embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle(`Has sido avisado de __${message.guild.name}__`)
                    .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                    .setColor(client.color)
                    .setTimestamp()
                ] }).catch(() => { message.reply(`<:error:1012451217693221015> **| No he podido enviarle el mensaje al usuario!**`)});
                
                //enviamos un embed al canal
                message.reply({ embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle(`<:check:1012042903381610496> **| Usuario avisado!**`)
                    .setDescription(`Se ha avisado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)* del servidor`)
                    .addFields([ { name: 'Razón', value: `\n\`\`\`yml\n${razon}\`\`\``} ])
                    .setColor(client.color)
                    .setTimestamp()
                ] })

                //creamos el objeto del warn
                let objeto_warn = {
                    fecha: Date.now(),
                    autor: message.author.id,
                    razon
                }
                await warnSchema.findOneAndUpdate({ guildID: message.guild.id, userID: usuario.id }, {
                    $push: {
                        warnings: objeto_warn
                    }
                })    

            } else {
                return message.reply(`<:nope_normal:1012749750459695114> **| Tu rol está por __debajo__ del usuario que quieres avisar!**`)
            }
        } else {
            return message.reply(`<:nope_normal:1012749750459695114> **| Mi rol está por __debajo__ del usuario que quieres avisar!**`)
        }

    }
}