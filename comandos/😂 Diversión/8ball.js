const { EmbedBuilder } = require('discord.js')
const serverSchema = require('../../modelos/servidor.js');
module.exports = {
    name: "8ball",
    aliases: ["bola8", "pregunta"],
    desc: "El bot te responderá una pregunta random",
    permisos_bot: [],
    permisos: [],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {
            const texto = args.join(" ")
            if (!texto) return message.reply(`<:nope_normal:1012749750459695114> **| Debes escribir una pregunta!**`);

            var cmd = [
                "Si",
                "No",
                "Probablemente",
                "Definitivamente no",
                "Definitivamente si",
                "Tal vez",
                "No sé",
                "Probablemente no",
                "Obviamente si",
                "Obviamente no",
                "Pregúntame otra cosa...",
                "Mejor no hablemos de esto..."
            ];
            var random = Math.floor(Math.random() * (cmd.length));

            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**🎱 Bola Mágica**`)
                        .addFields([
                            { name:  "> Pregunta", value: ` ${texto}` },
                            { name: "> Respuesta", value: ` ${cmd[random]}` }
                        ])
                        .setColor('Random')

                ]
            })

        } catch(e) {
            console.log(e);
            message.reply({ embeds: [
                new EmbedBuilder()
                .setTitle('<:error:1012451217693221015> | Ocurrió un error!')
                .setDescription(`\`\`\`js\n${e.toString().substring(0, 2048)}\`\`\``)
                .setColor('Red')
                .setFooter({ text: `Por favor utiliza el comando ${schema.prefijo}report-bug para reportar este error!` })
            ] })
        }
    } 
}