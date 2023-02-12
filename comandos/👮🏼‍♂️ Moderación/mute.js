const Discord = require('discord.js');
const serverSchema = require('../../modelos/servidor.js');
module.exports = {
    name: "mute",
    aliases: ["silenciar", "muted"],
    desc: "Sirve para silenciar a un miembro",
    permisos_bot: ["ManageRoles"],
    permisos: ["MuteMembers"],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {

            let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
            if (!usuario) return message.reply(`<:nope_normal:1012749750459695114> *| No se ha encontrado el usuario que has especificado!*`)
            let razon = args.slice(1).join(" ") || "No especificado";
            let rol = message.guild.roles.cache.find(rol => rol.name.toLowerCase() === 'muted')

            //Comprobar roles del bot
            if (message.guild.members.me.roles.highest.position > usuario.roles.highest.position) {

                //Comprobar posiciones de los roles
                if (message.member.roles.highest.position > usuario.roles.highest.position) {
                    //Enviamos un embed al usuario
                    usuario.send({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setTitle(`Has sido silenciado en __${message.guild.name}__`)
                                .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                                .setColor(client.color)
                                .setTimestamp()
                        ]
                    }).catch(() => { message.reply(`<:error:1012451217693221015> *| No he podido enviarle el mensaje al usuario!*`) });

                    //enviamos un embed al canal
                    message.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setTitle(`<:check:1012042903381610496> **| Usuario silenciado!**`)
                                .setDescription(`Se ha silenciado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)* en el servidor`)
                                .addFields([{ name: 'Razón', value: `\n\`\`\`yml\n${razon}\`\`\`` }])
                                .setColor(client.color)
                                .setTimestamp()
                        ]
                    })

                    usuario.roles.add(rol)

                } else {
                    return message.reply(`<:nope_normal:1012749750459695114> *| Tu rol está por __debajo__ del usuario que quieres silenciar!*`)
                }
            } else {
                return message.reply(`<:nope_normal:1012749750459695114> *| Mi rol está por __debajo__ del usuario que quieres silenciar!*`)
            }

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