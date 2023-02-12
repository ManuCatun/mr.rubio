const Discord = require('discord.js');
const math = require('mathjs');
module.exports = {
    name: "calculadora",
    aliases: ["calc", "calculator"],
    desc: "El bot te ayudará a resolver una operación matemática    ",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        try {

            const ecuación = args.join(" ");
            const resultado = math.evaluate(ecuación);

            message.reply({ embeds: [
                new Discord.EmbedBuilder()
                .setTitle(`${ecuación}`)
                .setDescription(`\`\`\`js\n${resultado}\`\`\``)
                .setColor(client.color)
            ] })

        } catch (e) {
            console.log(e);
            message.reply({ embeds: [
                new Discord.EmbedBuilder()
                .setTitle('<:error:1012451217693221015> | Ocurrió un error!')
                .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                .setColor('Red')
                .setFooter({ text: `Por favor utiliza el comando ${prefix}report-bug para reportar este error!` })
            ] })
        }

    }
}