const { asegurar_todo } = require('../../utils/funciones.js');
const warnSchema = require('../../modelos/warns.js');
const { paginacion } = require('../../utils/funciones.js');
module.exports = {
    name: "warnings",
    aliases: ["warns", "user-warnings"],
    desc: "Sirve para ver los warnings de un usuario",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        const usuario = message.guild.members.cache.get(args[0]) || message.mentions.members.filter(m => m.guild.id == message.guild.id).first() || message.member;
        await asegurar_todo(message.guild.id, usuario.id)
        let data = await warnSchema.findOne({guildID: message.guild.id, userID: usuario.id});
        if(data.warnings.length == 0) return message.reply(`<:check:1012042903381610496> **| \`${usuario.user.tag}\` no tiene ningún warning en el servidor!**`);
        const texto = data.warnings.map((warn, index) => `================================\n**ID DE WARN:** \`${index}\`\n**FECHA:** <t:${Math.round(warn.fecha / 1000)}>\n**AUTOR:** <@${warn.autor}> *\`${message.guild.members.cache.get(warn.autor).user.tag}\`*\n**RAZÓN:** \`${warn.razon}\`\n`)
        paginacion(client, message, texto, `🛠 \`[${data.warnings.length}]\` WARNINGS DE ${usuario.user.tag}`, 1)
    }
}