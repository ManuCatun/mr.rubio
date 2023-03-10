const { asegurar_todo } = require('../../utils/funciones.js');
const Discord = require('discord.js');
const warnSchema = require('../../modelos/warns.js')
module.exports = {
    name: "unwarn",
    aliases: ["deswarnear", "remove-warn"],
    desc: "Sirve para quitar un aviso a un usuario del servidor",
    permisos: ["ManageChannels"],
    permisos_bot: ["ManageChannels"],

    run: async (client, message, args, prefix) => {

        //Definimos la persona a banear
        let usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
        if (!usuario) return message.reply(`<:nope_normal:1012749750459695114> **| No se ha encontrado el usuario que has especificado!**`);
        await asegurar_todo(message.guild.id, usuario.id);
        let id_warn = args[1];
        let data = await warnSchema.findOne({ guildID: message.guild.id, userID: usuario.id });
        if (data.warnings.length === 0) return message.reply(`<:nope_normal:1012749750459695114> **| El usuario no tiene ningun warn!**`)
        if (!id_warn) return message.reply(`<:nope_normal:1012749750459695114> **| No se ha encontrado el warn que has especificado!**`)
        if (isNaN(id_warn) || id_warn < 0) return message.reply(`<:nope_normal:1012749750459695114> **| El ID del warn que has especificado no es válida!**`)
        if (data.warnings[id_warn] == undefined) return message.reply(`<:nope_normal:1012749750459695114> **| No se ha encontrado el warn que has especificado!**`)
            
            //Comprobar roles del bot
            if (message.guild.members.me.roles.highest.position > usuario.roles.highest.position) {

                //Comprobar posiciones de los roles
                if (message.member.roles.highest.position > usuario.roles.highest.position) {

                    //enviamos un embed al canal
                    message.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setTitle(`<:check:1012042903381610496> **| Warn removido!**`)
                                .setDescription(`Se ha removido el warn con ID \`${id_warn}\` exitosamente!`)   
                                .setColor(client.color)
                                .setTimestamp()
                        ]
                    })
                    data.warnings.splice(id_warn, 1);
                    data.save();

                } else {
                    return message.reply(`<:nope_normal:1012749750459695114> **| Tu rol está por __debajo__ del usuario que quieres avisar!**`)
                }
            } else {
                return message.reply(`<:nope_normal:1012749750459695114> **| Mi rol está por __debajo__ del usuario que quieres avisar!**`)

        }
    }
}