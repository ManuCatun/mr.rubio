const setupSchema = require('../modelos/setups.js');
const Discord = require('discord.js');

module.exports = client => {
    //evento al enviar el mensaje
    client.on("messageCreate", async message => {
        try {
            //comprobaciones
            if (!message.guild || !message.channel || message.author.bot) return;
            //buscamos los datos de la DB
            let setup_data = await setupSchema.findOne({ guildID: message.guild.id });
            if (!setup_data || !setup_data.confesiones || !message.guild.channels.cache.get(setup_data.confesiones) || message.channel.id !== setup_data.confesiones) return;

            const texto = message.content;

            //eliminamos la confesión enviada por el usuario
            message.delete().catch(() => { });
            //si el mensaje inicia por ! se tomará como una confesión anonima
            if (texto.startsWith('!')) {
                await message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setAuthor({ name: "Confesión de 🕵🏼‍♂️" })
                            .setDescription(`>>> ${texto.replace(/!/, "")}`)
                            .setColor(client.color)
                            .setFooter({ text: "Quieres confesar algo? Envía tu confesión aquí!", iconURL: message.guild.iconURL({ size: 1024, dynamic: true }) })
                    ]
                })
            } else {
                await message.channel.send({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setAuthor({ name: "Confesión de " + message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                            .setDescription(`>>> ${texto}`)
                            .setColor(client.color)
                            .setFooter({ text: "Quieres confesar algo? Envía tu confesión aquí!", iconURL: message.guild.iconURL({ size: 1024, dynamic: true }) })
                    ]
                })
            }
        } catch (e) {
            console.log(e)
        }
    })
}