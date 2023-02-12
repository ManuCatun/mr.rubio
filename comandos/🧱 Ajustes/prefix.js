const schema = require(`../../modelos/servidor.js`)
module.exports = {
    name: "prefix",
    aliases: ["prefijo", "set-prefix"],
    desc: "Sirve para cambiar el prefix del bot en el servidor",
    premium: true,
    permisos: ["Administrator"],

    run: async (client, message, args, prefix) => {

        if(!args[0]) return message.reply("**<:nope_normal:1012749750459695114> | Debes escribir el nuevo prefijo para el bot!**");
        
        await schema.findOneAndUpdate({ guildID: message.guild.id }, {
            prefijo: args[0]
        }) 
        return message.reply(`**<:check:1012042903381610496> | Prefijo cambiado de \`${prefix}\` a \`${args[0]}\`**`)

    }
}