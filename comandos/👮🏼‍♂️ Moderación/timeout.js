const ms = require('ms');
const Discord = require('discord.js');
module.exports = {
    name: "timeout",
    aliases: ["aislar"],
    desc: "Sirve para aislar a un usuario",
    permisos: ["ModerateMembers"],
    permisos_bot: ["ModerateMembers"],

    run: async (client, message, args, prefix) => {

        //Definimos la persona a banear
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(`<:nope_normal:1012749750459695114> *| No se ha encontrado el usuario que has especificado!*`)
        //Definimos el tiempo
        let tiempo = args[1];
        if (!tiempo) return message.reply(`<:nope_normal:1012749750459695114> **| Debes especificar un tiempo!**`);
        let tiempo_en_ms = ms(tiempo);
        if (!tiempo_en_ms || isNaN(tiempo_en_ms) || tiempo_en_ms < 0 || tiempo_en_ms % 1 != 0) return message.reply(`<:nope_normal:1012749750459695114> **| Debes especificar un tiempo válido!**`);
        //Definimos la razón
        let razon = args.slice(2).join(" ") || "No especificado"

        //Comprobar roles del bot
        if (message.guild.members.me.roles.highest.position > usuario.roles.highest.position) {

            //Comprobar posiciones de los roles
            if (message.member.roles.highest.position > usuario.roles.highest.position) {
                //Enviamos un embed al usuario
                usuario.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`Has sido aislado en __${message.guild.name}__`)
                            .setDescription(`**Razón:** \n\`\`\`yml\n${razon}\`\`\``)
                            .setColor(client.color)
                            .setTimestamp()
                    ]
                }).catch(() => { message.reply(`<:error:1012451217693221015> *| No he podido enviarle el mensaje al usuario!*`) });

                //enviamos un embed al canal
                message.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`<:check:1012042903381610496> **| Usuario aislado!**`)
                            .setDescription(`Se ha aislado exitosamente a \`${usuario.user.tag}\` *(\`${usuario.id}\`)* en servidor`)
                            .addFields([{ name: 'Razón', value: `\n\`\`\`yml\n${razon}\`\`\`` }])
                            .setColor(client.color)
                            .setTimestamp()
                    ]
                })

                usuario.timeout(tiempo_en_ms, { reason: razon })
            } else {
                return message.reply(`<:nope_normal:1012749750459695114> *| Tu rol está por __debajo__ del usuario que quieres aislar!*`)
            }
        } else {
            return message.reply(`<:nope_normal:1012749750459695114> *| Mi rol está por __debajo__ del usuario que quieres aislar!*`)
        }

    }
}