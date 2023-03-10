const { inspect } = require('util');
const Discord = require('discord.js');
module.exports = {
    name: "eval",
    aliases: ["evaluar", "ejecutar"],
    desc: "Sirve para ejecutar código de Discord.js V14",
    owner: true,
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        try {

            if (!args.length) return message.reply(`<:nope_normal:1012749750459695114> **| Debes especificar un código para evaluar!**`);

            const evaluado = await eval(args.join(" "));
            const truncado = truncar(inspect(evaluado), 2045);

            message.channel.send({ embeds: [
                new Discord.EmbedBuilder()
                .setTitle('Evaluación')
                .setDescription(`\`\`\`js\n${truncado}\`\`\``)
                .setColor(client.color)
                .setTimestamp()
            ] })

        } catch (e) {
            message.channel.send({ embeds: [
                new Discord.EmbedBuilder()
                .setTitle('Evaluación')
                .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                .setColor('Red')
                .setTimestamp()
            ] })
        }

    }
}

function truncar(texto, n) {
    if (texto.length > n) {
       return texto.substring(0, n) + "..."
    } else {
        return texto;
    }
}