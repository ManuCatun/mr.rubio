const serverSchema = require('../../modelos/servidor.js');
const keySchema = require('../../modelos/clave.js');
module.exports = {
    name: "claim",
    aliases: ["reclamar", "claim-key"],
    desc: "Sirve para reclamar una clave premium",
    permisos_bot: [],
    permisos: ["Administrator"],

    run: async (client, message, args, prefix) => {

        const clave = await keySchema.findOne({ clave: args[0] });
        if (clave) {
            if (clave.activado) {
                return message.reply("<:nope_normal:1012749750459695114> **| Esta clave ya ha sido utilizada!**")
            } else {
                clave.activado = true;
                clave.save();

                //activamos la clave en el servidor
                await serverSchema.findOneAndUpdate({ guildID: message.guild.id }, {
                    premium: Math.round(Date.now() + Number(clave.duracion))
                });

                return message.reply(`<:check:1012042903381610496> **| Se han activado las funciones premium en este servidor!** \nExpirará en: <t:${Math.round((Date.now() + Number(clave.duracion)) / 1000)}:R>`)
            } 
        } else {
            return message.reply("<:nope_normal:1012749750459695114> **| No se ha encontrado esta clave!**")
        }

    }
}