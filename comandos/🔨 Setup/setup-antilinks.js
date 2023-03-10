const setupSchema = require('../../modelos/setups.js');
const serverSchema = require('../../modelos/servidor.js');
const Discord = require('discord.js');
module.exports = {
    name: "setup-antilink",
    aliases: ["antilinks", "antilink", "setup-antilinks"],
    desc: "Activa o desactiva el sistema anti-links",
    permisos_bot: [],
    permisos: ["ManageMessages"],

    run: async (client, message, args, prefix) => {

        let schema = await serverSchema.findOne({ guildID: message.guild.id })

        try {

            let setups_data = await setupSchema.findOne({ guildID: message.guild.id });
            setups_data.antilinks = !setups_data.antilinks
            setups_data.save();

            message.reply(`**Se ha ${setups_data.antilinks ? "ACTIVADO" : "DESACTIVADO"} el sistema anti-links**`)

        } catch(e) {
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